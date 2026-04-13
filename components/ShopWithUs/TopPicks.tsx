// components/TopPicks.tsx
"use client";

import { useApp } from "../AppContext";
import { ChevronRight, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ProductPrice from "../ProductPrice";
import AddToCart from "../AddToCart";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TopPicks() {
  const { allProducts: products } = useApp();
  const pathName = usePathname();

  const shopTypeMap: Record<string, string> = {
    "/shop/men": "men",
    "/shop/women": "women",
  };

  const shopType = shopTypeMap[pathName] || "";
  const productTarget = products.filter((product) =>
    product.target.toLowerCase().includes(shopType),
  );

  if (productTarget.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl px-5 py-3 flex flex-row justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h1 className="font-semibold text-lg text-white">
              Top Picks for You
            </h1>
          </div>
          <ChevronRight
            color="white"
            strokeWidth={2}
            className="cursor-pointer hover:translate-x-1 transition-transform duration-300"
          />
        </div>

        {/* Products Grid - Horizontal Scroll */}
        <div className="relative">
          <div className="flex flex-row gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {productTarget.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="shrink-0 w-52 sm:w-56 bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <Link
                  href={`/item-description?id=${item.id}&name=${item.name.toLowerCase()}`}
                >
                  <div className="relative bg-gray-50">
                    <Image
                      src={item.imageUrl[0]}
                      alt={item.name || "item-image"}
                      width={224}
                      height={224}
                      className="w-full h-48 sm:h-52 object-cover hover:scale-105 transition-transform duration-500"
                    />
                    {item.discount && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                        -{item.discount}%
                      </span>
                    )}
                    {/* Quick view overlay */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
                  </div>

                  <div className="p-3">
                    <p className="text-gray-800 font-medium text-sm truncate hover:text-blue-600 transition-colors">
                      {item.name}
                    </p>

                    {item.discount ? (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 line-through">
                          <ProductPrice yuanPrice={item.price} />
                        </p>
                        <p className="text-lg font-bold text-red-600">
                          <ProductPrice
                            yuanPrice={item.price}
                            discount={item.discount}
                          />
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-lg font-bold text-blue-900">
                        <ProductPrice yuanPrice={item.price} />
                      </p>
                    )}
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
