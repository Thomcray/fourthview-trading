// components/Shirts.tsx
"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ChevronRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AddToCart from "../AddToCart";
import ProductPrice from "../ProductPrice";
import { useApp } from "../AppContext";
import { motion } from "framer-motion";

export default function Shirts() {
  const { allProducts: products } = useApp();
  const pathName = usePathname();

  const shopTypeMap: Record<string, string> = {
    "/shop/men": "men",
    "/shop/women": "women",
  };

  const shopType = shopTypeMap[pathName] || "";

  const productShirts = products.filter(
    (product) => product.productType.toLowerCase() === "shirts",
  );

  const target = productShirts.filter((item) =>
    item.target.toLowerCase().includes(shopType),
  );

  if (target.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-blue-800 to-blue-700 rounded-xl px-5 py-3 flex flex-row justify-between items-center shadow-md"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">👕</span>
            <h2 className="font-semibold text-lg text-white">Shirts</h2>
            <span className="bg-white/20 text-white text-xs font-medium px-2 py-0.5 rounded-full ml-2">
              {target.length} items
            </span>
          </div>
          <ChevronRight
            color="white"
            strokeWidth={2}
            className="cursor-pointer hover:translate-x-1 transition-transform duration-300"
          />
        </motion.div>

        {/* Products Horizontal Scroll */}
        <div className="relative">
          <div className="flex flex-row gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {target.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="shrink-0 w-64 sm:w-72 bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <Link
                  href={`/item-description?id=${item.id}&name=${item.name.toLowerCase()}`}
                >
                  {/* Product Image */}
                  <div className="relative bg-gray-50 h-56 sm:h-64">
                    <Image
                      src={item.imageUrl[0]}
                      alt={item.name || "item-image"}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 256px, 288px"
                    />
                    {/* Discount Badge */}
                    {item.discount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{item.discount}%
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-gray-800 font-semibold text-sm truncate hover:text-blue-600 transition-colors">
                      {item.name}
                    </p>

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

                {/* Action Buttons */}
                <div className="px-4 pb-4 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 font-medium rounded-lg"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
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
