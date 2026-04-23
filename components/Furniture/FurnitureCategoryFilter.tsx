"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sofa,
  Armchair,
  Home,
  LayoutGrid,
  Minus,
  BriefcaseBusiness,
} from "lucide-react";

const FURNITURE_CATEGORIES = [
  { id: "All Categories", label: "All Categories", icon: LayoutGrid },
  { id: "Modern Style", label: "Modern Style", icon: Sofa },
  { id: "Antique", label: "Antique", icon: Armchair },
  { id: "Chinese Style", label: "Chinese Style", icon: Home },
  { id: "Minimalist", label: "Minimalist", icon: Minus },
  { id: "Office", label: "Office", icon: BriefcaseBusiness },
];

type Props = {
  selected: string;
  onSelect: (cat: string) => void;
};

export default function FurnitureCategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="w-full">
      {/* Scrollable Container */}
      <div className="flex flex-row gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {FURNITURE_CATEGORIES.map((cat, index) => {
          const isSelected = selected === cat.id;
          const Icon = cat.icon;

          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(cat.id)}
              className={`
                group relative shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full 
                text-sm font-medium transition-all duration-300 cursor-pointer
                ${
                  isSelected
                    ? "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-200"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-700 hover:shadow-sm"
                }
              `}
            >
              {/* Icon */}
              <Icon
                className={`w-4 h-4 transition-colors ${isSelected ? "text-white" : "text-gray-500 group-hover:text-blue-600"}`}
              />

              {/* Label */}
              <span>{cat.label}</span>

              {/* Active Indicator Dot */}
              {isSelected && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Scroll Indicator for Mobile */}
      <div className="relative lg:hidden">
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-gray-50 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
