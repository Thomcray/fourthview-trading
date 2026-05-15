"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { NormalizedProduct } from "@/types/product";
import ProductCard from "./ProductCard";

interface Props {
  isOpen: boolean;
  products: NormalizedProduct[];
  onClear: () => void;
}

export default function SearchOverlay({ isOpen, products, onClear }: Props) {
  // Internal state for the search input and display
  const [searchTerm, setSearchTerm] = useState("");
  const [displayTerm, setDisplayTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Debounce the display term and filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayTerm(searchTerm);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredProducts = useMemo(() => {
    if (!displayTerm.trim()) return [];
    const q = displayTerm.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [displayTerm, products]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-white/95 backdrop-blur-sm overflow-y-auto pt-32 pb-12 px-4"
        >
          <div className="w-full max-w-7xl mx-auto">
            {/* Search input inside overlay */}
            <div className="relative mb-6">
              <input
                ref={inputRef}
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md mx-auto block pl-12 pr-10 py-3 text-base rounded-xl border border-gray-200 focus:border-blue-400 bg-white shadow-lg"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Search Results for &quot;{displayTerm}&quot;
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Found {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={onClear}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close search results"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  No products found matching &quot;{displayTerm}&quot;
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
