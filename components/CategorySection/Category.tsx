"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useApp } from "@/components/AppContext";

const PALETTES = [
  "from-blue-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-green-500 to-emerald-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
  "from-purple-500 to-violet-600",
  "from-red-500 to-red-600",
  "from-teal-500 to-teal-600",
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTES[Math.abs(hash) % PALETTES.length];
}

// Define the grouped category type
type GroupedCategory = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  color: string;
  images: string[];
};

export default function Category() {
  const { allProducts, allCategories } = useApp();

  if (!allCategories?.length) return null;

  const catMap = new Map(allCategories.map((c) => [c.id, c]));

  const grouped = allProducts.reduce<Record<string, GroupedCategory>>(
    (acc, product) => {
      const cat = catMap.get(product.categoryId);
      if (!cat) return acc;

      if (!acc[cat.slug]) {
        acc[cat.slug] = {
          ...cat,
          color: getColor(cat.name),
          images: [],
        };
      }
      if (acc[cat.slug].images.length < 4 && product.imageUrl?.[0]) {
        acc[cat.slug].images.push(product.imageUrl[0]);
      }
      return acc;
    },
    {},
  );

  const categories = Object.values(grouped);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-8">
      {categories.map((cat) => (
        <motion.div key={cat.slug} whileHover={{ y: -5 }}>
          <Link href={`/category/${cat.slug}`}>
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden">
              <div className={`bg-gradient-to-r ${cat.color} p-4 text-center`}>
                <h3 className="font-bold text-lg text-white">{cat.name}</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {cat.images.map((src: string, i: number) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                  </div>
                ))}
                {Array.from({ length: 4 - cat.images.length }).map((_, i) => (
                  <div
                    key={`e${i}`}
                    className="aspect-square rounded-lg bg-gray-100"
                  />
                ))}
              </div>
              <div className="p-4 text-center">
                <span className="text-sm font-medium text-blue-600 flex items-center justify-center gap-1">
                  Shop Now <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
