"use client";

import AddToCart from "@/components/AddToCart";
import { useApp } from "@/components/AppContext";
import ProductPrice from "@/components/ProductPrice";
import { MinusIcon, PlusIcon, ShoppingCart, Truck, Weight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Item = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  discount?: number;
  discountType?: string;
  target: string;
  imageUrl: string[];
  productType: string;
  colours: string[];
  sizes: string[];
  weight: string;
  shippingCost: number;
};

type SelectedItem = Item | undefined | null;

type ViewProductProps = {
  selectedItem: SelectedItem;
};

export default function ViewProduct({ selectedItem }: ViewProductProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColour, setSelectedColour] = useState<string | null>(null);
  const [sizeUpdated, setSizeUpdated] = useState(false);
  const [colourUpdated, setColourUpdated] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);

  const { cart, updateQuantity, updateSize } = useApp();
  const inCart = cart.find((item) => item.itemName === selectedItem?.name);
  const hasSizes = (selectedItem?.sizes?.length ?? 0) > 0;
  const hasColours = (selectedItem?.colours?.length ?? 0) > 0;

  useEffect(() => {
    setImageIdx(0);
    setSelectedSize(null);
    setSelectedColour(null);
    setSizeUpdated(false);
    setColourUpdated(false);
  }, [selectedItem?.id]);

  useEffect(() => {
    if (inCart?.size) {
      setSelectedSize(inCart.size);
    } else if (!inCart) {
      setSelectedSize(null);
    }
  }, [inCart?.size, inCart]);

  const handleImageColour = (idx: number) => {
    if (!selectedItem) return;
    const safeIdx = Math.min(
      idx,
      Math.max(0, selectedItem.imageUrl.length - 1),
    );
    setImageIdx(safeIdx);
    const colour = selectedItem.colours[idx];
    setSelectedColour(colour);
    if (inCart) {
      setColourUpdated(true);
      setTimeout(() => setColourUpdated(false), 2000);
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    if (inCart) {
      updateSize(selectedItem!.name, size);
      setSizeUpdated(true);
      setTimeout(() => setSizeUpdated(false), 2000);
    }
  };

  const handleQuantityChange = (newQty: number) => {
    if (!inCart || !selectedItem) return;
    updateQuantity(selectedItem.name, Math.max(1, newQty));
  };

  if (!selectedItem) return null;

  const missingSize = hasSizes && !selectedSize;
  const missingColour = hasColours && !selectedColour;
  const canAddToCart = !missingSize && !missingColour;

  return (
    <div className="w-full px-8 max-sm:px-2 py-8 flex flex-col lg:flex-row gap-8">
      {/* Left — image + colour swatches */}
      <div className="flex flex-col gap-4 lg:w-2/5">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#E4E8F6] to-[#B6C1E7]">
          <Image
            src={selectedItem.imageUrl[imageIdx] ?? selectedItem.imageUrl[0]}
            alt={selectedItem.name}
            fill
            className="object-cover"
          />
          {selectedItem.discount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{selectedItem.discount}% OFF
            </span>
          )}
        </div>

        {hasColours && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <p className="text-sm font-medium text-slate-700">
                {inCart ? "Change Colour" : "Select Colour"}
              </p>
              {colourUpdated && (
                <span className="text-xs text-green-600 font-medium animate-pulse">
                  ✓ Colour updated in cart
                </span>
              )}
            </div>
            <div className="flex flex-row gap-2 flex-wrap">
              {selectedItem.colours.map((colour, idx) => (
                <button
                  key={idx}
                  style={{ backgroundColor: colour }}
                  onClick={() => handleImageColour(idx)}
                  className={`relative w-8 h-8 rounded-full border-2 cursor-pointer transition-all
                    ${
                      selectedColour === colour
                        ? "border-blue-500 scale-110 shadow-md"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                >
                  {selectedColour === colour && (
                    <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right — product info */}
      <div className="flex flex-col gap-5 flex-1">
        {/* Name + price */}
        <div className="flex flex-col gap-1 pb-4 border-b">
          <h2 className="text-2xl font-semibold text-slate-800">
            {selectedItem.name}
          </h2>
          <div className="flex flex-row items-center gap-3 mt-1">
            {selectedItem.discount ? (
              <>
                <span className="text-xl font-bold text-red-500">
                  <ProductPrice
                    yuanPrice={selectedItem.price}
                    discount={selectedItem.discount}
                  />
                </span>
                <span className="text-base text-slate-400 line-through">
                  <ProductPrice yuanPrice={selectedItem.price} />
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-blue-950">
                <ProductPrice yuanPrice={selectedItem.price} />
              </span>
            )}
          </div>
        </div>

        {/* Weight + shipping */}
        {selectedItem.weight && (
          <div className="flex flex-row gap-4 flex-wrap">
            <div className="flex flex-row items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
              <Weight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-600">
                {selectedItem.weight} kg
              </span>
            </div>
            <div className="flex flex-row items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
              <Truck className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-600">
                Shipping: <ProductPrice yuanPrice={selectedItem.shippingCost} />
              </span>
            </div>
          </div>
        )}

        {/* Sizes */}
        {hasSizes && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <p className="text-sm font-medium text-slate-700">
                {inCart ? "Change Size" : "Select Size"}
              </p>
              {sizeUpdated && (
                <span className="text-xs text-green-600 font-medium animate-pulse">
                  ✓ Size updated in cart
                </span>
              )}
            </div>
            <div className="flex flex-row gap-2 flex-wrap">
              {selectedItem.sizes.map((size, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSizeChange(size)}
                  className={`relative text-sm px-3 py-1.5 border cursor-pointer transition-all rounded
                    ${
                      selectedSize === size
                        ? "border-blue-500 bg-blue-50 text-blue-900 font-medium"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                    }`}
                >
                  {size}
                  {selectedSize === size && (
                    <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity (only if in cart) */}
        {inCart && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-slate-700">Quantity</p>
            <div className="flex flex-row items-center gap-2 w-fit border rounded-md overflow-hidden">
              <button
                className="px-3 py-2 hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => handleQuantityChange((inCart.quantity || 1) - 1)}
              >
                <MinusIcon className="w-4 h-4 text-blue-950" />
              </button>
              <span className="px-4 text-sm font-semibold">
                {inCart.quantity}
              </span>
              <button
                className="px-3 py-2 hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => handleQuantityChange((inCart.quantity || 1) + 1)}
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
              <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                ⚠️ Please select a colour to add to cart
              </p>
            )}
            {missingSize && (
              <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                ⚠️ Please select a size to add to cart
              </p>
            )}
            <AddToCart
              data={selectedItem}
              selectedSize={selectedSize}
              selectedColour={selectedColour}
              disableIfNoSize={hasSizes}
              disabled={!canAddToCart}
            />
          </div>
        )}

        {inCart && (
          <div className="flex flex-row items-center gap-2 text-green-600 text-sm font-medium">
            <ShoppingCart className="w-4 h-4" />
            <span>Added to cart</span>
          </div>
        )}

        {/* Description */}
        <div className="flex flex-col gap-2 pt-4 border-t">
          <h3 className="font-semibold text-base text-slate-800">
            Product Description
          </h3>
          <p className="text-sm font-light text-slate-600 leading-7">
            {selectedItem.description}
          </p>
          <p className="text-sm text-slate-500 leading-7">
            For special orders, please note that a special shipping fee will
            apply to ensure expedited processing and delivery.
          </p>
          <p className="text-sm text-slate-500 leading-7">
            If you have any questions or require further assistance, feel free
            to contact our customer support team.
          </p>
        </div>
      </div>
    </div>
  );
}
