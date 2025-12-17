"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useApp } from "./AppContext";
// import { v4 as uuidv4 } from "uuid";
// import { toast } from "react-toastify";
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
};

interface Data {
  data: AddItem;
}

export default function AddToCart({ data }: Data) {
  const { cart, addToCart } = useApp();
  const [isAdding, setIsAdding] = useState(false);

  const defaultImage = data.imageUrl[0];

  const newItem = {
    productId: data.id,
    itemName: data.name,
    description: data.description,
    price: data.price,
    discount: data.discount,
    categoryId: data.categoryId,
    image: defaultImage,
    // productId: uuidv4(),
  };

  const handleCart = async () => {
    setIsAdding(true);

    try {
      await addToCart(newItem);
    } catch (error) {
      console.log("Error adding to cart: ", error);
    } finally {
      setIsAdding(false);
    }
  };

  const itemInCart = cart.some((item) => item.itemName === data.name);

  return (
    <Button
      variant="outline"
      className="cursor-pointer px-4 w-fit"
      onClick={handleCart}
    >
      <ShoppingCart color={itemInCart ? "#22c55e" : "#334EAC"} />
      {isAdding && <span className="ml-2">Adding...</span>}
    </Button>
  );
}
