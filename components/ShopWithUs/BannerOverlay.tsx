"use client";

import Image from "next/image";
import Link from "next/link";
import { useApp } from "../AppContext";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Grid3X3 } from "lucide-react";

type CategoryColors = {
  color: string;
  bgColor: string;
  textColor: string;
  buttonColor: string;
};

// Brand-consistent color palettes for strategic categories
const BRAND_COLORS: Record<string, CategoryColors> = {
  Men: {
    color: "from-blue-600 to-blue-700",
    bgColor: "bg-blue-50",
    textColor: "text-blue-950",
    buttonColor: "hover:bg-blue-50",
  },
  Women: {
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    textColor: "text-pink-950",
    buttonColor: "hover:bg-pink-50",
  },
  Kids: {
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    textColor: "text-green-950",
    buttonColor: "hover:bg-green-50",
  },
  Furniture: {
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-950",
    buttonColor: "hover:bg-amber-50",
  },
  "Home & Living": {
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-950",
    buttonColor: "hover:bg-amber-50",
  },
  Electronics: {
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-950",
    buttonColor: "hover:bg-cyan-50",
  },
  Sports: {
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-950",
    buttonColor: "hover:bg-orange-50",
  },
  Beauty: {
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-950",
    buttonColor: "hover:bg-purple-50",
  },
};

// Fallback color palettes for auto-assigned categories
const FALLBACK_PALETTES: CategoryColors[] = [
  {
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-950",
    buttonColor: "hover:bg-indigo-50",
  },
  {
    color: "from-teal-500 to-teal-600",
    bgColor: "bg-teal-50",
    textColor: "text-teal-950",
    buttonColor: "hover:bg-teal-50",
  },
  {
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-950",
    buttonColor: "hover:bg-red-50",
  },
  {
    color: "from-lime-500 to-lime-600",
    bgColor: "bg-lime-50",
    textColor: "text-lime-950",
    buttonColor: "hover:bg-lime-50",
  },
  {
    color: "from-fuchsia-500 to-fuchsia-600",
    bgColor: "bg-fuchsia-50",
    textColor: "text-fuchsia-950",
    buttonColor: "hover:bg-fuchsia-50",
  },
  {
    color: "from-sky-500 to-sky-600",
    bgColor: "bg-sky-50",
    textColor: "text-sky-950",
    buttonColor: "hover:bg-sky-50",
  },
];

function getStringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getColorsForCategory(name: string): CategoryColors {
  if (BRAND_COLORS[name]) {
    return BRAND_COLORS[name];
  }

  const normalizedName = name.toLowerCase().trim();
  const hash = getStringHash(normalizedName);
  const paletteIndex = hash % FALLBACK_PALETTES.length;

  return FALLBACK_PALETTES[paletteIndex];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const imageVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3 } },
};

export default function BannerOverlay() {
  const { allProducts: products } = useApp();

  // Group products by slug
  const categoryMap = new Map<
    string,
    { name: string; slug: string; items: typeof products }
  >();

  products.forEach((product) => {
    if (!categoryMap.has(product.slug)) {
      const name = product.productType ?? "Other";

      categoryMap.set(product.slug, {
        name,
        slug: product.slug,
        items: [],
      });
    }
    categoryMap.get(product.slug)!.items.push(product);
  });

  // Convert to array - no hardcoded sorting, display as received from API
  const categories = Array.from(categoryMap.values()).map((cat) => ({
    ...cat,
    items: cat.items.slice(0, 4),
    ...getColorsForCategory(cat.name),
  }));

  return (
    <div className="relative -mt-20 sm:-mt-32 lg:-mt-40 z-10 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl px-5 py-3 flex flex-row justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-white" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <h2 className="font-semibold text-lg text-white">
                Shop by Product Type
              </h2>
            </div>
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

      {/* Categories Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
      >
        {categories.map((category) => (
          <motion.div
            key={category.slug}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="relative group"
          >
            {/* Link to ItemClient page with ?q=productType */}
            <Link
              href={`/item?q=${encodeURIComponent(category.name)}`}
              className="block h-full"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 h-full flex flex-col">
                {/* Category Header */}
                <div
                  className={`relative ${category.bgColor} p-6 text-center border-b border-gray-100`}
                >
                  <h2
                    className={`text-2xl font-bold ${category.textColor} mb-2`}
                  >
                    {category.name}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Shop the latest {category.name.toLowerCase()} collection
                  </p>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                      <ArrowRight className={`w-4 h-4 ${category.textColor}`} />
                    </div>
                  </div>
                </div>

                {/* Product Images Grid */}
                {category.items.length > 0 ? (
                  <div className="p-4 flex-1">
                    <div className="grid grid-cols-2 gap-3">
                      {category.items.map((item) => (
                        <motion.div
                          key={item.id}
                          variants={imageVariants}
                          whileHover="hover"
                          className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group/image"
                        >
                          <Image
                            src={item.imageUrl[0]}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover/image:scale-110"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 translate-y-full group-hover/image:translate-y-0 transition-transform duration-300">
                            <p className="text-white text-xs text-center truncate">
                              {item.name}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-4 text-center">
                      <span
                        className={`inline-flex items-center gap-2 text-sm font-medium ${category.textColor} ${category.buttonColor} px-4 py-2 rounded-lg transition-colors`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Shop All {category.name}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">Coming Soon</p>
                    <p className="text-gray-400 text-xs mt-1">
                      New {category.name.toLowerCase()} collection arriving soon
                    </p>
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute -top-10 left-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-20 -z-10" />
      <div className="absolute -bottom-10 right-0 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-20 -z-10" />
    </div>
  );
}
