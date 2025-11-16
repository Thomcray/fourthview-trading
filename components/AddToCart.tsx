"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useApp } from "./AppContext";
import { v4 as uuidv4 } from "uuid";
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
};

interface Data {
  data: AddItem;
}

export default function AddToCart({ data }: Data) {
  const { cart, setCart } = useApp();

  const handleCart = () => {
    const itemExists = cart.some((item) => item.itemName === data.name);

    if (itemExists) {
      toast.error("item already exists");
      return;
    }

    const newItem = {
      itemName: data.name,
      description: data.description,
      quantity: 1,
      price: data.price,
      discount: data.discount,
      categoryId: data.categoryId,
      productId: uuidv4(),
    };

    setCart((prev) => [...prev, newItem]);
  };

  return (
    <Button
      variant="outline"
      className="cursor-pointer px-4 w-fit"
      onClick={handleCart}
    >
      <ShoppingCart color="#334EAC" />
    </Button>
  );
}
