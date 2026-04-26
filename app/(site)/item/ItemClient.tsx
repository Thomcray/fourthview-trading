"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Heart, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useMemo, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/components/AppContext";
import AddToCart from "@/components/AddToCart";
import ProductPrice from "@/components/ProductPrice";

type SortOption = "default" | "price-asc" | "price-desc" | "name";

type FilterConfig = {
  mode: "productType" | "target" | "none";
  value: string;
  label: string;
};

function useFilterConfig(searchParams: URLSearchParams): FilterConfig {
  const query = searchParams.get("q");
  const target = searchParams.get("target");

  if (target) {
    return {
      mode: "target",
      value: target,
      label: target.charAt(0).toUpperCase() + target.slice(1),
    };
  }

  if (query) {
    return {
      mode: "productType",
      value: query,
      label: query.charAt(0).toUpperCase() + query.slice(1),
    };
  }

  return { mode: "none", value: "", label: "All Products" };
}

export default function ItemClient() {
  const { allProducts: products } = useApp();
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const searchParams = useSearchParams();
  const router = useRouter();

  const filter = useFilterConfig(searchParams);

  const categoryItems = useMemo(() => {
    if (filter.mode === "none") return products;

    const searchValue = filter.value.toLowerCase();

    return products.filter((product) => {
      if (filter.mode === "target") {
        return product.target?.toLowerCase() === searchValue;
      }
      return product.productType.toLowerCase() === searchValue;
    });
  }, [products, filter]);

  // Sort products
  const sortedItems = useMemo(() => {
    const items = [...categoryItems];
    switch (sortBy) {
      case "price-asc":
        return items.sort((a, b) => a.price - b.price);
      case "price-desc":
        return items.sort((a, b) => b.price - a.price);
      case "name":
        return items.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return items;
    }
  }, [categoryItems, sortBy]);

  const loading = products.length === 0;

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white py-12">
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
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Products Found
            </h2>
            <p className="text-gray-500 mb-6">
              We couldn&apos;t find any products matching &quot;{filter.label}
              &quot;.
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-blue-900 to-blue-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {filter.label}
            </h1>
            <p className="text-blue-100 max-w-2xl mx-auto">
              {filter.mode === "target"
                ? `Explore our ${filter.label.toLowerCase()} collection`
                : `Explore our collection of ${filter.label.toLowerCase()} products`}
            </p>
            <div className="inline-block mt-4 px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              {categoryItems.length}{" "}
              {categoryItems.length === 1 ? "Product" : "Products"}
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
              onChange={handleSortChange}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
          <p className="text-sm text-gray-500">
            Showing {sortedItems.length} of {categoryItems.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item, index) => (
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
                    <span className="absolute top-3 left-3 bg-linear-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md z-10">
                      -{item.discount}%
                    </span>
                  )}

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
              <div className="px-4 pb-4">
                <AddToCart data={item} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
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
