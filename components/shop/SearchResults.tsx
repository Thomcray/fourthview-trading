"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import { getAllProducts } from "@/app/_lib/data-services";

type Product = NonNullable<Awaited<ReturnType<typeof getAllProducts>>>[number];

interface Props {
  query: string;
  products: Product[];
}

export default function SearchResults({ query, products }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [query]);

  const hasResults = products.length > 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full flex-1 min-h-[60vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Search Results for &quot;{query}&quot;
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Found {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!hasResults ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-12 text-center"
            >
              <p className="text-gray-500 text-lg">
                No products found matching &quot;{query}&quot;
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Try searching with different keywords
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
