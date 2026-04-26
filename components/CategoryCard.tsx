"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";

type CategoryItem = {
  id: number;
  name: string;
  imageUrl: string[];
};

export type CategoryData = {
  name: string;
  slug: string;
  items: CategoryItem[];
  color: string;
  bgColor: string;
  textColor: string;
  buttonColor: string;
};

type CategoryCardProps = {
  category: CategoryData;
  linkHref: string;
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const imageVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3 } },
};

export default function CategoryCard({
  category,
  linkHref,
}: CategoryCardProps) {
  return (
    <motion.div
      key={category.slug}
      variants={itemVariants}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="relative group"
    >
      <Link href={linkHref} className="block h-full">
        <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 h-full flex flex-col">
          {/* Header */}
          <div
            className={`relative ${category.bgColor} p-6 text-center border-b border-gray-100`}
          >
            <h2 className={`text-2xl font-bold ${category.textColor} mb-2`}>
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

          {/* Images */}
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
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-2 translate-y-full group-hover/image:translate-y-0 transition-transform duration-300">
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
  );
}
