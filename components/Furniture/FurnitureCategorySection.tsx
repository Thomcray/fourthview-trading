"use client";

import { useApp } from "@/components/AppContext";
import { ChevronRight, Eye } from "lucide-react";
import { motion } from "framer-motion";
import AddToCart from "@/components/AddToCart";
import ProductPrice from "@/components/ProductPrice";
import Image from "next/image";
import Link from "next/link";

type Props = {
  categoryName: string;
};

export default function FurnitureCategorySection({ categoryName }: Props) {
  const { allProducts } = useApp();

  const items = allProducts.filter(
    (p) =>
      p.productType.toLowerCase() === "furniture" &&
      (p.target ?? "").toLowerCase().includes(categoryName.toLowerCase()),
  );

  if (items.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Section Header */}
      <div className="group">
        <div className="bg-linear-to-r from-blue-900 to-blue-800 rounded-xl px-5 py-3 flex flex-row justify-between items-center shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🪑</span>
            </div>
            <h2 className="text-white font-semibold text-lg">{categoryName}</h2>
            <span className="bg-white/20 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {items.length} items
            </span>
          </div>
          <Link
            href={`/category/furniture?style=${categoryName.toLowerCase()}`}
          >
            <ChevronRight
              color="white"
              strokeWidth={2}
              className="cursor-pointer group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {items.slice(0, 4).map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="group/product bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Link
              href={`/item-description?id=${item.id}&name=${item.name.toLowerCase()}`}
            >
              {/* Product Image */}
              <div className="relative bg-gray-100 overflow-hidden">
                <Image
                  src={item.imageUrl[0]}
                  alt={item.name}
                  width={400}
                  height={300}
                  className="w-full h-48 sm:h-56 object-cover group-hover/product:scale-105 transition-transform duration-500"
                />

                {/* Discount Badge */}
                {!!item.discount && item.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-linear-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md z-10">
                    -{item.discount}%
                  </span>
                )}

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/product:opacity-100 transition-opacity duration-300">
                  <div className="bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-full transform translate-y-4 group-hover/product:translate-y-0 transition-all duration-300 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Quick View
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-sm truncate group-hover/product:text-blue-600 transition-colors">
                  {item.name}
                </h3>

                {/* Price */}
                <div className="mt-2">
                  {!!item.discount && item.discount > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 line-through">
                        <ProductPrice yuanPrice={item.price} />
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        <ProductPrice
                          yuanPrice={item.price}
                          discount={item.discount}
                        />
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-blue-900">
                      <ProductPrice yuanPrice={item.price} />
                    </span>
                  )}
                </div>
              </div>
            </Link>

            {/* Add to Cart Button */}
            <div className="px-3 pb-3">
              <AddToCart data={item} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Link */}
      {items.length > 4 && (
        <div className="text-center mt-2">
          <Link
            href={`/category/furniture?style=${categoryName.toLowerCase()}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            View All {categoryName} Furniture
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
