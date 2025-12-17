"use client";

import React, { Suspense } from "react";
import Image from "next/image";

import cartEmpty from "@/public/cartEmpty.png";
import Link from "next/link";
import { useApp } from "@/components/AppContext";
import CartItems from "@/components/CartItems/CartItems";

export default function Cart() {
  const { cart } = useApp();
  const cartLen = cart.length;

  return (
    <section
      className={`flex flex-col w-full ${cartLen ? "mt-14 bg-white" : "h-dvh"} justify-center items-center border-0 space-y-4 bg-slate-100`}
    >
      {!cartLen ? (
        <div className="w-80 bg-white h-80 rounded-md shadow-xl flex flex-col justify-center items-center">
          <Image
            src={cartEmpty}
            alt="cart-empty"
            className="w-20 h-20 object-contain"
          />
          <h1 className="font-semibold text-blue-950">Your Cart is Empty</h1>

          <p className="text-sm text-blue-950">
            You have not added any item to your cart
          </p>

          <Link href="/shop" className="mt-10 text-sm underline">
            Return to shop
          </Link>
        </div>
      ) : (
        <Suspense
          fallback={<span className="text-sm font-light">Loading...</span>}
        >
          <CartItems />
        </Suspense>
      )}
    </section>
  );
}
