// components/ShopByCategory.tsx
"use client";

import { useApp } from "../AppContext";
import { ChevronRight, Grid3X3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ShopByCategory() {
  const { allCategories: categories } = useApp();

  if (categories.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <Link href="/category" className="group">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl px-5 py-3 flex flex-row justify-between items-center hover:from-blue-800 hover:to-blue-700 transition-all duration-300 shadow-md">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-white" />
              <h1 className="font-semibold text-lg text-white">
                Shop by Categories
              </h1>
            </div>
            <ChevronRight
              color="white"
              strokeWidth={2}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Categories Grid - Horizontal Scroll */}
        <div className="relative">
          <div className="flex flex-row gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {categories.map(
              (item, index) =>
                item.image_url && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="shrink-0"
                  >
                    <Link
                      href={`/category/${item.slug}`}
                      className="block group"
                    >
                      <div className="w-40 h-40 sm:w-44 sm:h-44 relative rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300">
                        <Image
                          src={item.image_url}
                          alt={item.name || "category-image"}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 160px, 176px"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Category Name */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white font-semibold text-sm text-center">
                            {item.name}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ),
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white via-white/80 to-transparent w-12 h-full pointer-events-none lg:hidden" />
        </div>
      </div>
    </section>
  );
}
