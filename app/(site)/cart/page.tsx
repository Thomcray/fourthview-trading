// app/cart/page.tsx (Improved original version)
"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Home } from "lucide-react";

import cartEmpty from "@/public/cartEmpty.png";
import { useApp } from "@/components/AppContext";
import CartItems from "@/components/CartItems/CartItems";

export default function Cart() {
  const { cart } = useApp();
  const cartLen = cart.length;

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {cartLen === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[80vh] px-4"
        >
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4">
              <h2 className="text-white font-semibold text-lg text-center">
                Your Cart
              </h2>
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                  <Image
                    src={cartEmpty}
                    alt="Empty cart"
                    width={80}
                    height={80}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Your Cart is Empty
              </h1>

              <p className="text-gray-500 text-sm mb-6">
                You haven&apos;t added any items to your cart yet.
              </p>

              <div className="flex flex-col space-y-3">
                <Link href="/shop">
                  <button
                    className="w-full bg-blue-900 hover:bg-blue-700 text-white font-medium py-3 
                  px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Start Shopping
                  </button>
                </Link>

                <Link href="/">
                  <button
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium 
                  py-3 px-6 rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    Continue Browsing
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Loading cart items...</p>
              </div>
            </div>
          }
        >
          <CartItems />
        </Suspense>
      )}
    </section>
  );
}
