"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useApp } from "@/components/AppContext";

const categoryColors: Record<string, string> = {
  caps: "from-yellow-500 to-amber-600",
  shoes: "from-orange-500 to-amber-600",
  bags: "from-pink-500 to-rose-600",
  slippers: "from-teal-500 to-cyan-600",
  shirts: "from-blue-500 to-blue-700",
  trousers: "from-purple-600 to-purple-800",
  jewelry: "from-rose-400 to-pink-600",
  jackets: "from-slate-600 to-slate-800",
  belts: "from-brown-500 to-amber-800",
};

export default function Category() {
  const { allProducts: products } = useApp();

  // Group products by productType, keeping up to 4 images per category
  const grouped = products.reduce<Record<string, string[]>>((acc, product) => {
    const type = product.productType.toLowerCase();
    if (!acc[type]) acc[type] = [];
    if (acc[type].length < 4 && product.imageUrl?.[0]) {
      acc[type].push(product.imageUrl[0]);
    }
    return acc;
  }, {});

  const categories = Object.entries(grouped);

  if (categories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 px-4 w-full sm:px-6 lg:px-8 py-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {categories.map(([category, images]) => {
          const displayName =
            category.charAt(0).toUpperCase() + category.slice(1);
          const gradientColor =
            categoryColors[category] || "from-gray-600 to-gray-700";

          return (
            <motion.div
              key={category}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={`/category/item?q=${category}`}
                className="block h-full"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
                  <div
                    className={`bg-gradient-to-r ${gradientColor} p-3 sm:p-4 text-center`}
                  >
                    <h3 className="font-bold text-lg sm:text-xl text-white">
                      {displayName}
                    </h3>
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {images.map((src, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                        >
                          <Image
                            src={src}
                            alt={`${category} product`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                          />
                        </div>
                      ))}

                      {/* Fill empty slots if fewer than 4 products */}
                      {Array.from({
                        length: Math.max(0, 4 - images.length),
                      }).map((_, i) => (
                        <div
                          key={`empty-${i}`}
                          className="relative aspect-square rounded-lg bg-gray-100"
                        />
                      ))}
                    </div>

                    <div className="mt-4 text-center">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                        Shop Now
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
