"use client";

import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package, ShoppingBag, Filter } from "lucide-react";
import { useState, useMemo, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import ProductPrice from "@/components/ProductPrice";
import AddToCart from "@/components/AddToCart";

type SortOption = "default" | "price-asc" | "price-desc" | "name";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { allProducts, allCategories } = useApp();
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const slug = params.slug as string;

  const currentCategory = allCategories?.find((cat) => cat.slug === slug);
  const categoryProducts = allProducts.filter(
    (product) => product.categoryId === currentCategory?.id,
  );

  const sortedProducts = useMemo(() => {
    const products = [...categoryProducts];
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
  }, [categoryProducts, sortBy]);

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  };

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Category Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            The category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            onClick={() => router.push("/shop")}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
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
              {currentCategory.name}
            </h1>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Explore our collection of {currentCategory.name.toLowerCase()}{" "}
              products
            </p>
            <div className="inline-block mt-4 px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              {categoryProducts.length}{" "}
              {categoryProducts.length === 1 ? "Product" : "Products"}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            Showing {sortedProducts.length} of {categoryProducts.length}{" "}
            products
          </p>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              There are no products in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <Link
                  href={`/item-description?id=${product.id}&name=${product.name.toLowerCase()}`}
                >
                  <div className="relative bg-gray-50">
                    <Image
                      src={product.imageUrl[0]}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
                    />
                    {product.discount && (
                      <span className="absolute top-2 left-2 bg-linear-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-gray-800 font-medium text-sm truncate">
                      {product.name}
                    </p>
                    <div className="mt-2">
                      {product.discount ? (
                        <div>
                          <p className="text-xs text-gray-400 line-through">
                            <ProductPrice yuanPrice={product.price} />
                          </p>
                          <p className="text-lg font-bold text-red-600">
                            <ProductPrice
                              yuanPrice={product.price}
                              discount={product.discount}
                            />
                          </p>
                        </div>
                      ) : (
                        <p className="text-lg font-bold text-blue-900">
                          <ProductPrice yuanPrice={product.price} />
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <AddToCart data={product} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
