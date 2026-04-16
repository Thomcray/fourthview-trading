"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useApp } from "./AppContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type AddItem = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  discount?: number;
  discountType?: string | null;
  target: string | null;
  imageUrl: string[];
  productType: string;
  colours: string[];
  sizes: string[];
  shippingCost: number;
};

interface Data {
  data: AddItem;
  selectedSize?: string | null;
  selectedColour?: string | null;
  disableIfNoSize?: boolean;
  disabled?: boolean;
}

export default function AddToCart({
  data,
  selectedSize = null,
  selectedColour = null,
  disableIfNoSize = false,
  disabled = false,
}: Data) {
  const { cart, addToCart } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const defaultImage = data.imageUrl[0];
  const hasSizes = data.sizes?.length > 0;
  const hasColours = data.colours?.length > 0;
  const itemInCart = cart.some((item) => item.itemName === data.name);

  const newItem = {
    productId: data.id,
    itemName: data.name,
    description: data.description,
    price: data.price,
    discount: data.discount,
    categoryId: data.categoryId,
    image: defaultImage,
    size: selectedSize,
    colour: selectedColour,
    shippingCost: data.shippingCost ?? 0,
    productSizes: data.sizes ?? [],
    productColours: data.colours ?? [],
  };

  const handleCart = async () => {
    if (hasSizes && !selectedSize) {
      if (disableIfNoSize) return;
      router.push(
        `/item-description?id=${data.id}&name=${data.name.toLowerCase()}`,
      );
      return;
    }

    if (hasColours && !selectedColour) return;

    setIsAdding(true);
    try {
      await addToCart(newItem);
      toast.success(`${data.name} added to cart!`);
    } catch (error) {
      toast.error((error as Error).message || "Failed to add to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  const isDisabled =
    isAdding ||
    disabled ||
    (disableIfNoSize && hasSizes && !selectedSize) ||
    (hasColours && !selectedColour);

  return (
    <Button
      variant="outline"
      className="cursor-pointer px-4 py-5 text-white text-base w-full bg-black disabled:opacity-50"
      onClick={handleCart}
      disabled={isDisabled}
    >
      {isAdding ? "Adding..." : "Add to cart"}
      {!isAdding && <ShoppingCart color={itemInCart ? "#22c55e" : "#334EAC"} />}
    </Button>
  );
}
