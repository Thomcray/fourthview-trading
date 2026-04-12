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
  ShoppingCart,
} from "lucide-react";
import ProductPrice from "../ProductPrice";
import dynamic from "next/dynamic";
import Image from "next/image";

const PaystackButton = dynamic(() => import("../PaystackButton"), {
  ssr: false,
  loading: () => (
    <Button disabled className="cursor-pointer h-10">
      Loading...
    </Button>
  ),
});

export default function CartItems() {
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const { cart, removeFromCart, updateQuantity, updateSize } = useApp();
  const router = useRouter();

  const subtotal = cart.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const discount = Number(item.discount) || 0;
    return acc + (price - (price * discount) / 100) * quantity;
  }, 0);

  const totalShipping = cart.reduce(
    (acc, item) => acc + (Number(item.shippingCost) || 0),
    0,
  );

  const totalDiscount = cart.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const discount = Number(item.discount) || 0;
    return acc + ((price * discount) / 100) * quantity;
  }, 0);

  const total = subtotal + totalShipping;

  const handleRemove = async (itemName: string) => {
    setRemovingItem(itemName);
    try {
      await removeFromCart(itemName);
    } catch (error) {
      console.error("Error removing from cart: ", error);
    } finally {
      setRemovingItem(null);
    }
  };

  return (
    <div className="w-full px-4 pb-10">
      {/* Header */}
      <div className="relative flex flex-row items-center py-4 mb-2">
        <Button
          variant="outline"
          type="button"
          className="cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft /> Back
        </Button>
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-row gap-1.5 items-center">
          <ShoppingBag size={22} />
          <h1 className="text-2xl font-semibold">My Cart</h1>
          {cart.length > 0 && (
            <span className="bg-blue-950 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
          <ShoppingCart size={48} strokeWidth={1} />
          <p className="text-base">Your cart is empty</p>
          <Button
            onClick={() => router.push("/shop")}
            className="cursor-pointer"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="w-full flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex flex-col gap-4 flex-1">
            {cart.map((item) => (
              <div
                key={item.itemName}
                className="flex flex-col border rounded-xl overflow-hidden bg-white shadow-sm"
              >
                <div className="flex flex-row gap-4 p-4">
                  {/* Image */}
                  {item.image && (
                    <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden border bg-slate-50">
                      <Image
                        src={item.image}
                        alt={item.itemName}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-2 w-full min-w-0">
                    {/* Name + size */}
                    <div>
                      <h1 className="text-base font-semibold text-slate-800 truncate">
                        {item.itemName}
                      </h1>
                      {item.size && (
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          Size: {item.size}
                        </span>
                      )}
                    </div>

                    {/* Size selector */}
                    {item.productSizes && item.productSizes.length > 0 && (
                      <div className="flex flex-row gap-1 flex-wrap">
                        {item.productSizes.map((size, idx) => (
                          <button
                            key={idx}
                            className={`text-xs border px-2 py-1 cursor-pointer rounded transition-all
                              ${
                                item.size === size
                                  ? "ring-2 ring-blue-400 bg-blue-50 border-blue-300"
                                  : "bg-white hover:border-blue-300"
                              }`}
                            onClick={() => updateSize(item.itemName, size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Price + quantity row */}
                    <div className="flex flex-row items-end justify-between gap-4 mt-1">
                      {/* Price */}
                      {item.price && (
                        <div className="flex flex-col gap-0.5">
                          {item.discount ? (
                            <>
                              <span className="text-xs text-slate-400 line-through">
                                <ProductPrice yuanPrice={item.price} />
                              </span>
                              <span className="text-sm font-semibold text-red-500">
                                <ProductPrice
                                  yuanPrice={item.price}
                                  discount={item.discount}
                                />
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-slate-800">
                              <ProductPrice yuanPrice={item.price} />
                            </span>
                          )}
                        </div>
                      )}

                      {/* Quantity */}
                      <div className="flex flex-row items-center border rounded-lg overflow-hidden shrink-0">
                        <button
                          className="px-2.5 py-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
                          onClick={() =>
                            updateQuantity(
                              item.itemName,
                              Math.max(1, (item.quantity || 1) - 1),
                            )
                          }
                        >
                          <MinusIcon className="w-3.5 h-3.5 text-blue-950" />
                        </button>
                        <span className="px-3 text-sm font-semibold border-x">
                          {item.quantity}
                        </span>
                        <button
                          className="px-2.5 py-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
                          onClick={() =>
                            updateQuantity(
                              item.itemName,
                              (item.quantity || 1) + 1,
                            )
                          }
                        >
                          <PlusIcon className="w-3.5 h-3.5 text-blue-950" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <div className="border-t px-4 py-2">
                  <button
                    className="flex flex-row items-center gap-1.5 text-xs text-red-400 hover:text-red-600 cursor-pointer transition-colors"
                    onClick={() => handleRemove(item.itemName)}
                    disabled={removingItem === item.itemName}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {removingItem === item.itemName ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="flex flex-col w-full lg:w-80 shrink-0 border rounded-xl h-fit shadow-sm overflow-hidden">
            <div className="bg-blue-950 py-4 px-4">
              <h1 className="text-white font-semibold text-base">
                Cart Summary
              </h1>
            </div>

            <div className="flex flex-col gap-3 px-4 py-4">
              <div className="flex flex-row justify-between text-sm">
                <p className="text-slate-500">Subtotal</p>
                <ProductPrice yuanPrice={subtotal} />
              </div>

              <div className="flex flex-row justify-between text-sm">
                <p className="text-slate-500">Shipping</p>
                <ProductPrice yuanPrice={totalShipping} />
              </div>

              {totalDiscount > 0 && (
                <div className="flex flex-row justify-between text-sm">
                  <p className="text-slate-500">Discount</p>
                  <span className="text-green-600 font-medium">
                    - <ProductPrice yuanPrice={totalDiscount} />
                  </span>
                </div>
              )}

              <div className="flex flex-row justify-between border-t pt-3">
                <p className="font-bold text-base text-slate-800">Total</p>
                <span className="font-bold text-base">
                  <ProductPrice yuanPrice={total} />
                </span>
              </div>

              <PaystackButton total={total} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
