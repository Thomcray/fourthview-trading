"use client";

import React from "react";
import Image from "next/image";

import cartEmpty from "@/public/cartEmpty.png";
import Link from "next/link";

export default function Cart() {
  return (
    <section className="flex flex-col w-full h-dvh justify-center items-center border space-y-4 bg-slate-100">
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
    </section>
  );
}
