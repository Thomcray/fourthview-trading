"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/components/AppContext";
import AddToCart from "@/components/AddToCart";
import ProductPrice from "@/components/ProductPrice";

export default function ItemClient() {
  const { allProducts: products } = useApp();
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("q");

  const categoryItems = useMemo(() => {
    if (!category) return [];
    return products.filter(
      (product) => product.productType.toLowerCase() === category.toLowerCase(),
    );
  }, [products, category]);

  const loading = products.length === 0;

  const toggleWishlist = (itemId: number) => {
    setWishlist((prev) => {
      const newSet = new Set(prev);
      newSet.has(itemId) ? newSet.delete(itemId) : newSet.add(itemId);
      return newSet;
    });
  };

  const displayName = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Products";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-64 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (categoryItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Products Found
            </h2>
            <p className="text-gray-500 mb-6">
              We couldn&apos;t find any products in the {displayName} category.
            </p>
            <Button
              onClick={() => router.push("/shop")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-950">
              {displayName}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {categoryItems.length} products found
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Link
                href={`/item-description?id=${item.id}&name=${item.name.toLowerCase()}`}
              >
                {/* Product Image */}
                <div className="relative bg-gray-100 h-64 overflow-hidden">
                  <Image
                    src={item.imageUrl[0]}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {item.discount && item.discount > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
                      -{item.discount}%
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(item.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 z-10"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        wishlist.has(item.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>

                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Quick View
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2 hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>

                  <div className="mt-2">
                    {item.discount && item.discount > 0 ? (
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

              {/* Action Buttons */}
              <div className="px-4 pb-4 flex gap-2">
                <AddToCart data={item} />
              </div>
            </motion.div>
          ))}
        </div>

        {categoryItems.length >= 8 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8"
            >
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
