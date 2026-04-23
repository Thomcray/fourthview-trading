"use client";

import { useApp } from "../AppContext";
import { ChevronRight, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ProductPrice from "../ProductPrice";
import AddToCart from "../AddToCart";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTopPicks } from "@/hooks/useTopPicks";

export default function TopPicks() {
  const { allProducts } = useApp();
  const pathName = usePathname();

  const slug = pathName.split("/shop/")[1] ?? "";

  // Get curated top picks
  const topPicks = useTopPicks(allProducts, slug, {
    limit: 10,
    shuffle: true,
    requireImages: true,
  });

  // Don't render if no products
  if (topPicks.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <Link href="/collection/top-picks">
          <div className="bg-linear-to-r from-blue-900 to-blue-800 rounded-xl px-5 py-3 flex flex-row justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <h1 className="font-semibold text-lg text-white">
                  Top Picks for You
                </h1>
                {/* <span className="bg-white/20 text-white text-xs font-medium px-2 py-0.5 rounded-full ml-2">
                  {allProducts.filter((p) => p.slug === slug).length === 1
                    ? "1 item"
                    : `${allProducts.filter((p) => p.slug === slug).length} items`}
                </span> */}
              </div>
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
          <div className="flex flex-row gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 snap-x snap-mandatory">
            {topPicks.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ y: -8 }}
                className="shrink-0 w-52 sm:w-56 snap-start bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
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

                    {/* Badges Stack */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {item.badge && (
                        <span
                          className={`
                          text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md
                          ${
                            item.badge.includes("%")
                              ? "bg-linear-to-r from-red-500 to-red-600"
                              : item.badge === "New"
                                ? "bg-linear-to-r from-green-500 to-green-600"
                                : "bg-linear-to-r from-blue-500 to-blue-600"
                          }
                        `}
                        >
                          {item.badge}
                        </span>
                      )}
                      {!!item.discount && !item.badge?.includes("%") && (
                        <span className="bg-linear-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                          -{item.discount}%
                        </span>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  <div className="p-3">
                    <p className="text-gray-800 font-medium text-sm truncate hover:text-blue-600 transition-colors">
                      {item.name}
                    </p>

                    {/* Reasons chips */}
                    {item.reasons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.reasons.slice(0, 2).map((reason, i) => (
                          <span
                            key={i}
                            className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price */}
                    {item.discount ? (
                      <div className="mt-2">
                        <div className="text-xs text-gray-400 line-through">
                          <ProductPrice yuanPrice={item.price} />
                        </div>
                        <div className="text-lg font-bold text-red-600">
                          <ProductPrice
                            yuanPrice={item.price}
                            discount={item.discount}
                          />
                        </div>
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
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-linear-to-l from-white via-white/80 to-transparent w-12 h-full pointer-events-none lg:hidden" />
        </div>
      </div>
    </section>
  );
}
