"use client";

import { ChevronRight, Eye, BadgeCheck, Car as CarIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getPublicImageUrl } from "@/lib/images";
import ProductPrice from "../ProductPrice";

export type CarType = {
  id: number;
  brandName: string;
  year: number;
  condition: string;
  mileage: number;
  totalPrice: number;
  imageUrl: string[];
};

type Props = {
  condition: "New" | "Used";
  cars: CarType[];
  hideWhenEmpty?: boolean;
};

export default function CarConditionSection({
  condition,
  cars,
  hideWhenEmpty = false,
}: Props) {
  const items = cars;

  if (items.length === 0) {
    if (hideWhenEmpty) {
      return null;
    }

    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 py-12 text-center">
        <CarIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />

        <h3 className="text-gray-700 font-semibold">
          No {condition.toLowerCase()} cars available
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Check back soon for {condition.toLowerCase()} car listings.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Section Header */}
      <div className="group">
        <div className="bg-linear-to-r from-blue-900 to-blue-800 rounded-xl px-5 py-3 flex flex-row justify-between items-center shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              {condition === "New" ? (
                <BadgeCheck className="w-5 h-5 text-white" />
              ) : (
                <CarIcon className="w-5 h-5 text-white" />
              )}
            </div>

            <h2 className="text-white font-semibold text-lg">
              {condition === "New" ? "New Cars" : "Used Cars"}
            </h2>

            <span className="bg-white/20 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {items.length} {items.length === 1 ? "car" : "cars"}
            </span>
          </div>

          <Link href={`/car/all?condition=${condition.toLowerCase()}`}>
            <ChevronRight
              color="white"
              strokeWidth={2}
              className="cursor-pointer group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>

      {/* Car Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {items.slice(0, 4).map((car, index) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="group/car bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Link href={`/car/${car.id}`}>
              {/* Car Image */}
              <div className="relative bg-gray-100 overflow-hidden">
                {car.imageUrl?.[0] ? (
                  <Image
                    src={getPublicImageUrl(car.imageUrl[0])}
                    alt={`${car.year} ${car.brandName}`}
                    width={400}
                    height={300}
                    className="w-full h-48 sm:h-56 object-cover group-hover/car:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-48 sm:h-56 bg-gray-200 flex items-center justify-center">
                    <CarIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                {/* Condition Badge */}
                <span
                  className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md z-10 ${
                    condition === "New"
                      ? "bg-linear-to-r from-green-500 to-green-600"
                      : "bg-linear-to-r from-amber-500 to-amber-600"
                  }`}
                >
                  {condition}
                </span>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/car:opacity-100 transition-opacity duration-300">
                  <div className="bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-full transform translate-y-4 group-hover/car:translate-y-0 transition-all duration-300 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Details
                  </div>
                </div>
              </div>

              {/* Car Info */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-sm truncate group-hover/car:text-blue-600 transition-colors">
                  {car.brandName}
                </h3>

                <p className="text-xs text-gray-500 mt-0.5">
                  {car.year}
                  {condition === "Used" &&
                    ` • ${car.mileage.toLocaleString()} km`}
                </p>

                <div className="mt-2">
                  <span className="text-lg font-bold text-blue-900">
                    <ProductPrice yuanPrice={car.totalPrice} />
                  </span>

                  <span className="text-xs text-gray-400 ml-1">
                    (incl. shipping &amp; clearing)
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* View All Link */}
      {items.length > 4 && (
        <div className="text-center mt-2">
          <Link
            href={`/car/all?condition=${condition.toLowerCase()}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            View All {condition} Cars
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
