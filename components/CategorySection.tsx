"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CategoryGroup } from "../hooks/useCategoryGroups";
import CategoryCard from "./CategoryCard";

type CategorySectionProps = {
  title: string;
  icon: React.ReactNode;
  headerGradient: string; // e.g., "from-blue-900 to-blue-800"
  categories: CategoryGroup[];
  linkParam: string;
  containerVariants: Variants;
  decorativeColors: [string, string];
  className?: string;
};

export function CategorySection({
  title,
  icon,
  headerGradient,
  categories,
  linkParam,
  containerVariants,
  decorativeColors,
  className = "",
}: CategorySectionProps) {
  return (
    <div className={`relative z-10 px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div
          className={`bg-linear-to-r ${headerGradient} rounded-xl px-5 py-3 flex flex-row justify-between items-center shadow-md`}
        >
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="font-semibold text-lg text-white">{title}</h2>
          </div>
          <Link href="/shop">
            <ArrowRight
              color="white"
              strokeWidth={2}
              className="cursor-pointer hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.slug}
            category={category}
            linkHref={`/item?${linkParam}=${encodeURIComponent(category.name)}`}
          />
        ))}
      </motion.div>

      {/* Decorative */}
      <div
        className={`absolute -top-10 left-0 w-32 h-32 ${decorativeColors[0]} rounded-full blur-3xl opacity-20 -z-10`}
      />
      <div
        className={`absolute -bottom-10 right-0 w-40 h-40 ${decorativeColors[1]} rounded-full blur-3xl opacity-20 -z-10`}
      />
    </div>
  );
}
