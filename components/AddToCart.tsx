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
  discountType?: string;
  target: string;
  imageUrl: string[];
  productType: string;
  colours: string[];
  sizes: string[];
  shippingCost: number;
};

interface Data {
  data: AddItem;
  selectedSize?: string | null;
  disableIfNoSize?: boolean;
}

export default function AddToCart({
  data,
  selectedSize = null,
  disableIfNoSize = false,
}: Data) {
  const { cart, addToCart } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const defaultImage = data.imageUrl[0];
  const hasSizes = data.sizes?.length > 0;
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
    shippingCost: data.shippingCost ?? 0,
    productSizes: data.sizes ?? [],
  };

  const handleCart = async () => {
    // Navigate to product page to select size first
    if (hasSizes && !selectedSize) {
      if (disableIfNoSize) return;

      router.push(
        `/item-description?id=${data.id}&name=${data.name.toLowerCase()}`,
      );
      return;
    }

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

  return (
    <Button
      variant="outline"
      className="cursor-pointer px-4 py-5 text-white text-base w-full bg-black disabled:opacity-50"
      onClick={handleCart}
      disabled={isAdding || (disableIfNoSize && hasSizes && !selectedSize)}
    >
      {isAdding ? "Adding..." : "Add to cart"}
      {!isAdding && <ShoppingCart color={itemInCart ? "#22c55e" : "#334EAC"} />}
    </Button>
  );
}
