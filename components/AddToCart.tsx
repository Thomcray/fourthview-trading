"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useApp } from "./AppContext";
import { useState } from "react";

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
}

export default function AddToCart({ data, selectedSize = null }: Data) {
  const { cart, addToCart } = useApp();
  const [isAdding, setIsAdding] = useState(false);

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
    shippingCost: data.shippingCost,
    productSizes: data.sizes,
  };

  const handleCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(newItem);
    } catch (error) {
      console.error("Error adding to cart: ", error);
    } finally {
      setIsAdding(false);
    }
  };

  const buttonLabel = () => {
    if (isAdding) return "Adding...";
    if (hasSizes && !selectedSize) return "Select a size";
    return "Add to cart";
  };

  return (
    <Button
      variant="outline"
      className="cursor-pointer px-4 py-5 text-white text-base w-full bg-black disabled:opacity-50"
      onClick={handleCart}
      disabled={isAdding || (hasSizes && !selectedSize)}
    >
      {buttonLabel()}
      {!isAdding && <ShoppingCart color={itemInCart ? "#22c55e" : "#334EAC"} />}
    </Button>
  );
}
