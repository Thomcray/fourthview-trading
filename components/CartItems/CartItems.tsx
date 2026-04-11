"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useApp } from "../AppContext";
import {
  ArrowLeft,
  ShoppingBag,
  Trash2,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import ProductPrice from "../ProductPrice";
import dynamic from "next/dynamic";
import Image from "next/image";

// Dynamically import PaystackButton to avoid window error during SSR
const PaystackButton = dynamic(() => import("../PaystackButton"), {
  ssr: false,
  loading: () => (
    <Button disabled className="cursor-pointer h-10">
      Loading...
    </Button>
  ),
});

export default function CartItems() {
  const [isRemoving, setIsRemoving] = useState(false);
  const { cart, removeFromCart, updateQuantity, updateSize } = useApp();

  const cartItems = cart.map((item) => item);

  const router = useRouter();

  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const discount = Number(item.discount) || 0;
    const discountedPrice = price - (price * discount) / 100;
    return acc + discountedPrice * quantity;
  }, 0);

  const totalShipping = cartItems.reduce((acc, item) => {
    return acc + (Number(item.shippingCost) || 0);
  }, 0);

  const totalDiscount = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const discount = Number(item.discount) || 0;
    return acc + ((price * discount) / 100) * quantity;
  }, 0);

  const total = subtotal + totalShipping;

  const handleRemove = async (itemName: string) => {
    setIsRemoving(true);

    try {
      await removeFromCart(itemName);
    } catch (error) {
      console.error("Error removing from cart: ", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="w-full border-0 px-4">
      <div className="relative flex flex-row items-center py-2">
        <Button
          variant="outline"
          type="button"
          className="cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft /> Back
        </Button>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-row gap-0.5 items-center">
          <ShoppingBag size={24} />
          <h1 className="text-2xl font-semibold">My Cart</h1>
        </div>
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
                    {item.size && (
                      <span className="text-xs text-slate-500">
                        Size: {item.size}
                      </span>
                    )}

                    {/* Size selector */}
                    {item.productSizes && item.productSizes.length > 0 && (
                      <div className="flex flex-row gap-1 mt-2 flex-wrap">
                        {item.productSizes.map((size, idx) => (
                          <button
                            key={idx}
                            className={`text-xs border px-2 py-1 cursor-pointer rounded-none
              ${item.size === size ? "ring-2 ring-blue-400 bg-blue-50" : "bg-accent"}`}
                            onClick={() => updateSize(item.itemName, size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}
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
                    <div className="flex flex-row items-center gap-1 lg:justify-center">
                      <MinusIcon
                        className="h-6 w-6 text-blue-950 border rounded-md p-1 cursor-pointer bg-white"
                        onClick={() =>
                          updateQuantity(
                            item.itemName,
                            Math.max(1, (item.quantity || 1) - 1),
                          )
                        }
                      />
                      <span className="px-2 text-sm font-medium">
                        {item.quantity}
                      </span>
                      <PlusIcon
                        className="h-6 w-6 text-blue-950 border rounded-md p-1 cursor-pointer bg-white"
                        onClick={() =>
                          updateQuantity(
                            item.itemName,
                            (item.quantity || 1) + 1,
                          )
                        }
                      />
                    </div>
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

        <div className="flex flex-col w-80 max-sm:w-full border-y pb-2">
          <h1 className="w-full border-b py-4 text-center">Cart Summary</h1>

          <div className="flex flex-row justify-between mt-4">
            <p className="text-slate-500">Shipping cost</p>
            <ProductPrice yuanPrice={totalShipping} />
          </div>

          <div className="flex flex-row justify-between py-2">
            <p className="text-slate-500">Discount</p>
            {totalDiscount > 0 ? (
              <span className="text-green-600">
                - <ProductPrice yuanPrice={totalDiscount} />
              </span>
            ) : (
              <p className="text-slate-500">—</p>
            )}
          </div>

          <div className="flex flex-row justify-between py-2">
            <p className="font-bold text-xl text-slate-800">Estimated Total</p>
            <ProductPrice yuanPrice={total} />
          </div>

          <PaystackButton total={total} />
        </div>
      </div>
    </div>
  );
}
