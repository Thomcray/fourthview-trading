"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "./CartContext";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

type AddItem = {
  item: string;
  price: number;
};

interface Data {
  data: AddItem;
}

export default function AddToCart({ data }: Data) {
  const { cart, setCart } = useCart();

  const handleCart = () => {
    const itemExists = cart.some((item) => item.itemName === data.item);

    if (itemExists) {
      toast.error("item already exists");
      return;
    }

    const newItem = {
      itemName: data.item,
      description: "Hello",
      quantity: 1,
      price: data.price,
      discount: 0,
      categoryId: 2,
      productId: uuidv4(),
    };

    setCart((prev) => [...prev, newItem]);

    console.log(cart);
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
