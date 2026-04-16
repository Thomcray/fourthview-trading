// components/OnSale.tsx
"use client";

import { ChevronRight, Flame, Percent } from "lucide-react";
import Image from "next/image";
import ProductPrice from "../ProductPrice";
import { useApp } from "../AppContext";
import AddToCart from "../AddToCart";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OnSale() {
  const { allProducts: products } = useApp();

  const discountProducts = products.filter((item) => item.discount);
  const sortedByDiscount = [...discountProducts].sort(
    (a, b) => (b.discount || 0) - (a.discount || 0),
  );

  if (sortedByDiscount.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <Link href="/collection/on-sale">
          <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-xl px-5 py-3 flex flex-row justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 rounded-full p-1.5">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <h1 className="font-semibold text-lg text-white">Flash Sale</h1>
              <span className="bg-white text-red-600 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                {sortedByDiscount.length} Items
              </span>
            </div>
            <ChevronRight
              color="white"
              strokeWidth={2}
              className="cursor-pointer hover:translate-x-1 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Products Grid - Horizontal Scroll */}
        <div className="relative">
          <div className="flex flex-row gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-gray-100">
            {sortedByDiscount.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="shrink-0 w-52 sm:w-56 bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative"
              >
                {/* Sale Badge Ribbon */}
                <div className="absolute top-3 left-0 z-10">
                  <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-r-lg shadow-md flex items-center gap-1">
                    <Percent className="w-3 h-3" />-{item.discount}% OFF
                  </div>
                </div>

                <Link
                  href={`/item-description?id=${item.id}&name=${item.name.toLowerCase()}`}
                >
                  <div className="relative bg-gray-50 pt-2">
                    <Image
                      src={item.imageUrl[0]}
                      alt={item.name || "item-image"}
                      width={224}
                      height={224}
                      className="w-full h-48 sm:h-52 object-cover hover:scale-105 transition-transform duration-500"
                    />
                    {/* Quick view overlay */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
                  </div>

                  <div className="p-3">
                    <p className="text-gray-800 font-medium text-sm truncate hover:text-red-600 transition-colors">
                      {item.name}
                    </p>

                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-400 line-through">
                          <ProductPrice yuanPrice={item.price} />
                        </div>
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                          -{item.discount}%
                        </span>
                      </div>
                      <div className="text-lg font-bold text-red-600 mt-1">
                        <ProductPrice
                          yuanPrice={item.price}
                          discount={item.discount}
                        />
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-3 pb-3">
                  <AddToCart data={item} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white via-white/80 to-transparent w-12 h-full pointer-events-none lg:hidden" />
        </div>
      </div>
    </section>
  );
}
