"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import ProductPrice from "@/components/ProductPrice";
import AddToCart from "@/components/AddToCart";
import { getAllProducts } from "@/app/_lib/data-services";
import { getPublicImageUrl } from "@/lib/images";

type Product = NonNullable<Awaited<ReturnType<typeof getAllProducts>>>[number];

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const imageUrl = product.imageUrl?.[0] ?? "/placeholder-product.png";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <Link
        href={`/item-description?id=${product.id}&name=${encodeURIComponent(
          product.name.toLowerCase(),
        )}`}
      >
        <div className="relative bg-gray-100 h-48 overflow-hidden">
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              src={getPublicImageUrl(imageUrl)}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </motion.div>

          <AnimatePresence>
            {product.discount ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
              >
                -{product.discount}%
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="p-4">
          <motion.h3
            className="font-medium text-gray-800 line-clamp-2"
            whileHover={{ color: "#2563eb" }}
            transition={{ duration: 0.2 }}
          >
            {product.name}
          </motion.h3>

          <div className="mt-2">
            {product.discount ? (
              <div className="space-y-0.5">
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-gray-400 line-through"
                >
                  <ProductPrice yuanPrice={product.price} />
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg font-bold text-red-600"
                >
                  <ProductPrice
                    yuanPrice={product.price}
                    discount={product.discount}
                  />
                </motion.p>
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-bold text-blue-900"
              >
                <ProductPrice yuanPrice={product.price} />
              </motion.p>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <AddToCart data={product} />
      </div>
    </motion.article>
  );
}
