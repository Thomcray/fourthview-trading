"use client";

import React, { useState } from "react";
import { useApp } from "../AppContext";
import Image from "next/image";
import { ShoppingBag, Trash2 } from "lucide-react";
import ProductPrice from "../ProductPrice";
import { Button } from "../ui/button";
import PaystackButton from "../PaystackButton";

export default function CartItems() {
  const [isRemoving, setIsRemoving] = useState(false);
  const { cart, removeFromCart } = useApp();

  const cartItems = cart.map((item) => item);

  const total = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return acc + price * quantity;
  }, 0);

  const handleRemove = async (itemName: string) => {
    setIsRemoving(true);

    try {
      await removeFromCart(itemName);
    } catch (error) {
      console.log("Error removing from cart: ", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="w-full border-0 px-4">
      <div className="flex flex-row gap-0.5 items-center py-2 lg:justify-center">
        <ShoppingBag size={24} />
        <h1 className="text-2xl font-semibold">My Cart</h1>
      </div>

      <div className="w-full flex flex-row max-sm:flex-col gap-10 border-0">
        {cart.map((item) => (
          <div
            key={item.itemName}
            className="w-5xl max-sm:w-full flex flex-col gap-0.5 border-y"
          >
            <div className="py-4 px-4 flex flex-row items-center gap-3 bg-white border-0">
              <div className="w-full flex flex-row gap-2 border-0">
                {item.image && item.itemName && (
                  <div className="w-40 h-40 border rounded-md">
                    <Image
                      src={item.image}
                      alt={item.itemName}
                      width={200}
                      height={200}
                      className="object-cover w-full"
                    />
                  </div>
                )}

                <div className="flex self-start lg:flex-row max-sm:flex-col md:flex-col sm:flex-col sm:gap-3 max-sm:gap-3 border-0 w-full">
                  <div className="w-full">
                    <h1 className="text-base font-semibold text-slate-800">
                      {item.itemName}
                    </h1>
                    {/* <span></span> */}
                  </div>
                  <div className="flex flex-col gap-0.5 w-40">
                    <p className="text-sm">Price</p>
                    {item?.price && (
                      <p className="text-base font-normal">
                        <ProductPrice yuanPrice={item.price} />
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5 w-40 lg:text-center">
                    <p className="text-sm">Quantity</p>
                    <p className="lg:text-center text-sm font-medium">
                      {item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="border-0 w-fit cursor-pointer hover:bg-white"
              onClick={() => handleRemove(item.itemName)}
            >
              <Trash2 className="text-destructive" />
              {isRemoving ? "Removing..." : "Remove"}
            </Button>
          </div>
        ))}

        <div className="flex flex-col w-80 max-sm:w-full border-y-1 pb-2">
          <h1 className="w-full border-b-1 py-4 text-center">Cart Summary</h1>

          <div className="flex flex-row justify-between mt-4">
            <p className="text-slate-500">Shipping cost</p>
            <p></p>
          </div>

          <div className="py-2">
            <p className="text-slate-500">Discount</p>
            <p></p>
          </div>

          <div className="flex flex-row gap-2 items-center justify-between py-2">
            <p className="font-bold text-xl text-slate-800">Estimated Total</p>
            <ProductPrice yuanPrice={total} />
            <p></p>
          </div>

          <PaystackButton total={total} />
        </div>
      </div>
    </div>
  );
}
