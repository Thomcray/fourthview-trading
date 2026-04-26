"use client";

import { Users } from "lucide-react";
import { useApp } from "./AppContext";
import { useCategoryGroups } from "../hooks/useCategoryGroups";
import { CategorySection } from "./CategorySection";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export default function AudienceBanner() {
  const { allProducts } = useApp();
  const categories = useCategoryGroups(allProducts, "target");

  if (categories.length <= 1 && categories[0]?.name === "General") {
    return null; // Don't show if everything is unclassified
  }

  return (
    <CategorySection
      title="Shop by Audience"
      icon={<Users className="w-5 h-5 text-white" />}
      headerGradient="from-violet-900 to-purple-800"
      categories={categories}
      linkParam="target"
      containerVariants={containerVariants}
      decorativeColors={["bg-violet-200", "bg-amber-200"]}
      className="mt-16"
    />
  );
}
