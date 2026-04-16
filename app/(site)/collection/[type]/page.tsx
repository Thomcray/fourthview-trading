// app/collection/[type]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Filter, ShoppingBag, Sparkles, Flame } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import ProductPrice from "@/components/ProductPrice";
import AddToCart from "@/components/AddToCart";
import { useTopPicks, TopPick } from "@/hooks/useTopPicks";

type CollectionType = "top-picks" | "on-sale";

const collectionConfig = {
  "top-picks": {
    title: "Top Picks for You",
    description: "Curated selection of products you'll love",
    icon: Sparkles,
    iconColor: "text-yellow-400",
    gradient: "from-blue-900 to-blue-800",
  },
  "on-sale": {
    title: "On Sale",
    description: "Great deals and discounts just for you",
    icon: Flame,
    iconColor: "text-orange-400",
    gradient: "from-red-700 to-red-600",
  },
};

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const { allProducts } = useApp();
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "name"
  >("default");

  const collectionType = params.type as CollectionType;
  const config = collectionConfig[collectionType];

  // For top-picks, we need to get products from all categories
  // Pass empty string as categorySlug to get top picks from all products
  const topPicks = useTopPicks(allProducts, "", {
    limit: 100,
    shuffle: true,
    requireImages: true,
  });

  // Get products based on collection type
  const collectionProducts = useMemo(() => {
    if (collectionType === "top-picks") {
      return topPicks;
    }
    if (collectionType === "on-sale") {
      return allProducts.filter((p) => p.discount && p.discount > 0);
    }
    return [];
  }, [collectionType, topPicks, allProducts]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const products = [...collectionProducts];
    switch (sortBy) {
      case "price-asc":
        return products.sort((a, b) => a.price - b.price);
      case "price-desc":
        return products.sort((a, b) => b.price - a.price);
      case "name":
        return products.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return products;
    }
  }, [collectionProducts, sortBy]);

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Collection Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            The collection you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push("/shop")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  if (collectionProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div
          className={`relative bg-gradient-to-r ${config.gradient} py-12 px-4 sm:px-6 lg:px-8`}
        >
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Icon className={`w-8 h-8 ${config.iconColor}`} />
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  {config.title}
                </h1>
              </div>
              <p className="text-white/80 max-w-2xl mx-auto">
                {config.description}
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No products found
          </h3>
          <p className="text-gray-500">
            There are no products in this collection yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div
        className={`relative bg-gradient-to-r ${config.gradient} py-12 px-4 sm:px-6 lg:px-8`}
      >
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon className={`w-8 h-8 ${config.iconColor}`} />
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {config.title}
              </h1>
            </div>
            <p className="text-white/80 max-w-2xl mx-auto">
              {config.description}
            </p>
            <div className="inline-block mt-4 px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              {collectionProducts.length}{" "}
              {collectionProducts.length === 1 ? "Product" : "Products"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
          <p className="text-sm text-gray-500">
            Showing {sortedProducts.length} of {collectionProducts.length}{" "}
            products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product, index) => {
            // Check if this is a TopPick (has additional properties)
            const isTopPick =
              collectionType === "top-picks" && "reasons" in product;
            const topPickData = isTopPick ? (product as TopPick) : null;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Link
                  href={`/item-description?id=${product.id}&name=${product.name.toLowerCase()}`}
                >
                  {/* Product Image */}
                  <div className="relative bg-gray-100 h-64 overflow-hidden">
                    <Image
                      src={product.imageUrl[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Badges Stack - Same as Top Picks */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {/* Top Picks specific badge */}
                      {topPickData?.badge && (
                        <span
                          className={`
                          text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md
                          ${
                            topPickData.badge.includes("%")
                              ? "bg-gradient-to-r from-red-500 to-red-600"
                              : topPickData.badge === "New"
                                ? "bg-gradient-to-r from-green-500 to-green-600"
                                : "bg-gradient-to-r from-blue-500 to-blue-600"
                          }
                        `}
                        >
                          {topPickData.badge}
                        </span>
                      )}
                      {/* Discount badge (if discount exists and no badge already showing it) */}
                      {product.discount &&
                        product.discount > 0 &&
                        !topPickData?.badge?.includes("%") && (
                          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                            -{product.discount}%
                          </span>
                        )}
                    </div>

                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Quick View
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Reasons chips for top picks */}
                    {topPickData?.reasons && topPickData.reasons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {topPickData.reasons
                          .slice(0, 2)
                          .map((reason: string, i: number) => (
                            <span
                              key={i}
                              className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                            >
                              {reason}
                            </span>
                          ))}
                      </div>
                    )}

                    <div className="mt-2">
                      {product.discount && product.discount > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 line-through">
                            <ProductPrice yuanPrice={product.price} />
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            <ProductPrice
                              yuanPrice={product.price}
                              discount={product.discount}
                            />
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-blue-900">
                          <ProductPrice yuanPrice={product.price} />
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Action Buttons */}
                <div className="px-4 pb-4">
                  <AddToCart data={product} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Load More */}
        {collectionProducts.length >= 20 && (
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
