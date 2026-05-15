"use client";

import { useApp } from "@/components/AppContext";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { MapPin, MinusIcon, PlusIcon, ShoppingCart } from "lucide-react";
import { TopPickProduct } from "@/hooks/useTopPicks";
import AddToCart from "@/components/AddToCart";
import ShippingAddressModal from "@/components/ShippingAddressModal";
import ProductGallery from "@/components/ViewProduct/ProductGallery";
import ProductInfo from "@/components/ViewProduct/ProductInfo";

interface Props {
  selectedItem: TopPickProduct | null;
}

export default function ViewProduct({ selectedItem }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColour, setSelectedColour] = useState<string | null>(null);
  const [sizeUpdated, setSizeUpdated] = useState(false);
  const [colourUpdated, setColourUpdated] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const { cart, updateQuantity, updateVariant } = useApp();
  const { data: session, update } = useSession();

  const inCart = selectedItem
    ? cart.find(
        (item) =>
          item.productId === selectedItem.id &&
          item.colour === selectedColour &&
          item.size === selectedSize,
      )
    : undefined;

  const [shippingAddress, setShippingAddress] = useState({
    streetAddress: session?.user?.streetAddress ?? "",
    apartment: session?.user?.apartment ?? "",
    city: session?.user?.city ?? "",
    zipCode: session?.user?.zipCode ?? "",
    country: session?.user?.country ?? "",
  });

  // Reset on product change
  useEffect(() => {
    setSelectedSize(null);
    setSelectedColour(null);
    setSizeUpdated(false);
    setColourUpdated(false);
    setImageIdx(0);
    setImageLoading(false);
  }, [selectedItem?.id]);

  // Sync from cart
  useEffect(() => {
    if (!inCart || !selectedItem) return;
    if (inCart.size) setSelectedSize(inCart.size);
    if (inCart.colour) {
      setSelectedColour(inCart.colour);
      const colourIdx = selectedItem.colours.indexOf(inCart.colour);
      if (colourIdx !== -1) setImageIdx(colourIdx);
    }
  }, [selectedItem?.id, inCart, selectedItem]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageIdxChange = useCallback((idx: number) => {
    setImageLoading(true);
    setImageIdx(idx);
  }, []);

  const handleAddressConfirm = async (
    address: typeof shippingAddress,
    saveToProfile: boolean,
  ) => {
    setShippingAddress(address);
    setShowAddressModal(false);

    if (saveToProfile && session) {
      setIsSavingAddress(true);
      try {
        const res = await fetch("/api/users/shipping-address", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(address),
        });
        if (!res.ok) throw new Error("Failed to save address");

        await update({
          ...session,
          user: { ...session.user, ...address },
        });
        toast.success("Address saved!");
      } catch {
        toast.error("Failed to save address");
      } finally {
        setIsSavingAddress(false);
      }
    }
  };

  const handleColourChange = useCallback(
    async (idx: number) => {
      if (!selectedItem || isSwitching) return;
      const newColour = selectedItem.colours[idx];

      if (!inCart?.id) {
        setSelectedColour(newColour);
        return;
      }
      if (inCart.colour === newColour) return;

      const variantExists = cart.some(
        (item) =>
          item.productId === selectedItem.id &&
          item.colour === newColour &&
          item.size === selectedSize &&
          item.id !== inCart.id,
      );

      if (variantExists) {
        toast.info("This colour variant is already in your cart");
        return;
      }

      setIsSwitching(true);
      setSelectedColour(newColour);

      try {
        await updateVariant(
          inCart.id,
          { colour: newColour },
          inCart.productId!,
        );
        setColourUpdated(true);
        setTimeout(() => setColourUpdated(false), 2000);
        toast.success("Colour switched");
      } catch {
        toast.error("Failed to switch colour");
        setSelectedColour(inCart.colour ?? null);
      } finally {
        setIsSwitching(false);
      }
    },
    [selectedItem, inCart, cart, selectedSize, updateVariant, isSwitching],
  );

  const handleSizeChange = useCallback(
    async (newSize: string) => {
      if (!selectedItem || isSwitching) return;

      if (!inCart?.id) {
        setSelectedSize(newSize);
        return;
      }
      if (inCart.size === newSize) return;

      const variantExists = cart.some(
        (item) =>
          item.productId === selectedItem.id &&
          item.colour === selectedColour &&
          item.size === newSize &&
          item.id !== inCart.id,
      );

      if (variantExists) {
        toast.info("This size variant is already in your cart");
        return;
      }

      setIsSwitching(true);
      setSelectedSize(newSize);

      try {
        await updateVariant(inCart.id, { size: newSize }, inCart.productId!);
        setSizeUpdated(true);
        setTimeout(() => setSizeUpdated(false), 2000);
        toast.success("Size switched");
      } catch {
        toast.error("Failed to switch size");
        setSelectedSize(inCart.size ?? null);
      } finally {
        setIsSwitching(false);
      }
    },
    [selectedItem, inCart, cart, selectedColour, updateVariant, isSwitching],
  );

  const handleQuantityChange = useCallback(
    async (newQty: number) => {
      if (!inCart?.id) return;
      await updateQuantity(inCart.id, Math.max(1, newQty));
    },
    [inCart, updateQuantity],
  );

  if (!selectedItem) return null;

  const hasSizes = (selectedItem.sizes?.length ?? 0) > 0;
  const hasColours = (selectedItem.colours?.length ?? 0) > 0;
  const missingSize = hasSizes && !selectedSize;
  const missingColour = hasColours && !selectedColour;
  const canAddToCart = !missingSize && !missingColour;

  return (
    <div className="w-full px-8 max-sm:px-2 py-8 flex flex-col lg:flex-row gap-8">
      <ProductGallery
        product={selectedItem}
        imageIdx={imageIdx}
        onImageLoad={handleImageLoad}
        imageLoading={imageLoading}
      />

      <div className="flex flex-col gap-5 flex-1">
        <ProductInfo
          product={selectedItem}
          selectedSize={selectedSize}
          selectedColour={selectedColour}
          onSizeChange={handleSizeChange}
          onColourChange={handleColourChange}
          isSwitching={isSwitching}
          sizeUpdated={sizeUpdated}
          colourUpdated={colourUpdated}
          onImageIdxChange={handleImageIdxChange}
          imageIdx={imageIdx}
        />

        {/* Shipping Address */}
        {session?.user && (
          <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-medium text-gray-700">Deliver to</p>
              </div>
              <button
                onClick={() => setShowAddressModal(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {shippingAddress.streetAddress ? "Change" : "Add Address"}
              </button>
            </div>
            {shippingAddress.streetAddress ? (
              <p className="text-xs text-gray-600">
                {shippingAddress.streetAddress}
                {shippingAddress.apartment &&
                  `, ${shippingAddress.apartment}`}, {shippingAddress.city}
                {shippingAddress.zipCode && `, ${shippingAddress.zipCode}`}
                {shippingAddress.country && `, ${shippingAddress.country}`}
              </p>
            ) : (
              <p className="text-xs text-amber-600">
                ⚠️ No shipping address set.
              </p>
            )}
          </div>
        )}

        {/* Quantity */}
        {inCart && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-700">Quantity</p>
            <div className="flex flex-row items-center gap-2 w-fit border rounded-md overflow-hidden">
              <button
                className="px-3 py-2 hover:bg-slate-100 transition-colors"
                onClick={() => handleQuantityChange((inCart.quantity || 1) - 1)}
                disabled={isSwitching}
              >
                <MinusIcon className="w-4 h-4 text-blue-950" />
              </button>
              <span className="px-4 text-sm font-semibold">
                {isSwitching ? "..." : inCart.quantity}
              </span>
              <button
                className="px-3 py-2 hover:bg-slate-100 transition-colors"
                onClick={() => handleQuantityChange((inCart.quantity || 1) + 1)}
                disabled={isSwitching}
              >
                <PlusIcon className="w-4 h-4 text-blue-950" />
              </button>
            </div>
          </div>
        )}

        {/* Add to cart */}
        {!inCart && (
          <div className="w-full max-w-xs flex flex-col gap-2">
            {missingColour && (
              <p className="text-xs text-amber-600">⚠️ Select a colour</p>
            )}
            {missingSize && (
              <p className="text-xs text-amber-600">⚠️ Select a size</p>
            )}
            <AddToCart
              data={selectedItem}
              selectedSize={selectedSize}
              selectedColour={selectedColour}
              disableIfNoSize={hasSizes}
              disabled={!canAddToCart || isSwitching}
            />
          </div>
        )}

        {inCart && (
          <div className="flex flex-row items-center gap-2 text-green-600 text-sm font-medium">
            <ShoppingCart className="w-4 h-4" />
            <span>Added to cart</span>
          </div>
        )}
      </div>

      <ShippingAddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        initialAddress={shippingAddress}
        onConfirm={handleAddressConfirm}
        isSaving={isSavingAddress}
      />
    </div>
  );
}
