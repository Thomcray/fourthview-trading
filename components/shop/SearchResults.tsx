"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { getAllProducts } from "@/app/_lib/data-services";
import ProductCard from "./ProductCard";

type Product = NonNullable<Awaited<ReturnType<typeof getAllProducts>>>[number];

interface Props {
  query: string;
  products: Product[];
  onClear: () => void;
}

export default function SearchResults({ query, products, onClear }: Props) {
  const hasResults = products.length > 0;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Search Results for &quot;{query}&quot;
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Found {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={onClear}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close search results"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {!hasResults ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            No products found matching &quot;{query}&quot;
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Try searching with different keywords
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: Math.min(index * 0.05, 0.3),
                ease: "easeOut",
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
