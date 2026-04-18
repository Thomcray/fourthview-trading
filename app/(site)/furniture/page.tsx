// app/furniture/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Banner from "@/components/ShopWithUs/Banner";
import FurnitureCategoryFilter from "@/components/Furniture/FurnitureCategoryFilter";
import FurnitureCategorySection from "@/components/Furniture/FurnitureCategorySection";
import furnitureBanner from "@/public/furnitureBanner.png";
import { Home, Sofa, Armchair } from "lucide-react";

const CATEGORIES = ["Modern Style", "Antique", "Chinese Style"];

const categoryIcons = {
  "Modern Style": <Sofa className="w-5 h-5" />,
  Antique: <Armchair className="w-5 h-5" />,
  "Chinese Style": <Home className="w-5 h-5" />,
};

export default function FurniturePage() {
  const [selected, setSelected] = useState("All Categories");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or fetch data
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const categoriesToShow =
    selected === "All Categories" ? CATEGORIES : [selected];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Banner Section */}
      <Banner
        banner={furnitureBanner}
        location={true}
        bannerText="Make Your Home Feel Like Home"
      />

      {/* Category Filter */}
      <div className="sticky top-12 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <FurnitureCategoryFilter selected={selected} onSelect={setSelected} />
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12 sm:space-y-16"
            >
              {categoriesToShow.map((cat, index) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {/* Category Header with Icon */}
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-blue-100">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {categoryIcons[cat as keyof typeof categoryIcons] || (
                        <Home className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {cat}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Discover our {cat.toLowerCase()} collection
                      </p>
                    </div>
                  </div>

                  <FurnitureCategorySection categoryName={cat} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
