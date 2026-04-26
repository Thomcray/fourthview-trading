"use client";

import { Grid3X3 } from "lucide-react";
import { useApp } from "../AppContext";
import { CategorySection } from "../CategorySection";
import { useCategoryGroups } from "@/hooks/useCategoryGroups";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export default function BannerOverlay() {
  const { allProducts } = useApp();
  const categories = useCategoryGroups(allProducts, "productType");

  return (
    <CategorySection
      title="Shop by Product Type"
      icon={<Grid3X3 className="w-5 h-5 text-white" />}
      headerGradient="from-blue-900 to-blue-800"
      categories={categories}
      linkParam="q"
      containerVariants={containerVariants}
      decorativeColors={["bg-blue-200", "bg-pink-200"]}
    />
  );
}
