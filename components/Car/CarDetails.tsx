"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  BadgeCheck,
  Car as CarIcon,
  Calendar,
  Gauge,
  Tag,
  Ship,
  FileCheck,
  MessageCircle,
} from "lucide-react";

import CarReviews from "./CarReviews";
import { getPublicImageUrl } from "@/lib/images";
import ProductPrice from "../ProductPrice";

type CarDetailsProps = {
  id: number;
  created_at: string;
  brandName: string;
  year: number;
  condition: "New" | "Used";
  mileage: number;
  price: number;
  shippingCost: number;
  clearingCost: number;
  totalPrice: number;
  imageUrl: string[];
  sold: boolean;
};

type CarDetailsComponentProps = {
  car: CarDetailsProps;
  whatsappNumber?: string;
};

export default function CarDetails({
  car,
  whatsappNumber,
}: CarDetailsComponentProps) {
  const [activeImage, setActiveImage] = useState(0);

  const images = (car.imageUrl || []).map((url: string) =>
    getPublicImageUrl(url),
  );

  const isNew = car.condition === "New";

  const waMessage = encodeURIComponent(
    `Hello! I'm interested in the ${car.year} ${car.brandName} (ID: ${car.id}) listed at ${car.totalPrice}. Is it still available?`,
  );

  const specClass =
    "flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100";

  const iconClass =
    "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0";

  const labelClass = "text-xs text-gray-500";

  const valueClass = "font-semibold text-gray-800";

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-6xl">
        <Link
          href="/car"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Cars
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className={`relative bg-gray-100 rounded-2xl overflow-hidden shadow-md ${
                car.sold ? "opacity-90" : ""
              }`}
            >
              {images.length > 0 ? (
                <Image
                  src={images[activeImage]}
                  alt={`${car.year} ${car.brandName}`}
                  width={800}
                  height={600}
                  className={`w-full h-72 sm:h-96 object-cover ${
                    car.sold ? "grayscale" : ""
                  }`}
                  priority
                />
              ) : (
                <div className="w-full h-72 sm:h-96 flex items-center justify-center">
                  <CarIcon className="w-16 h-16 text-gray-300" />
                </div>
              )}

              {/* Sold Badge */}
              {car.sold && (
                <span className="absolute top-4 right-4 z-20 bg-red-600 text-white text-sm font-extrabold px-4 py-2 rounded-lg shadow-lg">
                  SOLD
                </span>
              )}

              {/* Sold Overlay */}
              {car.sold && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="bg-red-600 text-white text-3xl sm:text-4xl font-extrabold px-8 py-4 rounded-xl shadow-xl rotate-[-8deg]">
                    SOLD
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                {images.map((url: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`View ${i + 1}`}
                      fill
                      className={`object-cover ${car.sold ? "grayscale" : ""}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                {isNew ? (
                  <BadgeCheck className="w-4 h-4 text-green-600" />
                ) : (
                  <CarIcon className="w-4 h-4 text-amber-600" />
                )}
                <span>{isNew ? "Brand New" : "Pre-Owned"}</span>

                {car.sold && (
                  <span className="ml-2 bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-md">
                    SOLD
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {car.brandName}
              </h1>

              <p className="text-gray-500 mt-1">Model Year: {car.year}</p>
            </div>

            {/* Price */}
            <div
              className={`rounded-2xl p-5 border ${
                car.sold
                  ? "bg-gray-100 border-gray-200"
                  : "bg-blue-50 border-blue-100"
              }`}
            >
              <div className="text-center">
                <p
                  className={`text-sm mb-1 ${
                    car.sold ? "text-gray-500" : "text-blue-600"
                  }`}
                >
                  {car.sold ? "Final Listed Price" : "Total Price"}
                </p>

                <p
                  className={`text-3xl font-bold ${
                    car.sold ? "text-gray-500 line-through" : "text-blue-900"
                  }`}
                >
                  <ProductPrice yuanPrice={car.totalPrice} />
                </p>

                {!car.sold && (
                  <p className="text-xs text-blue-500 mt-2">
                    {car.shippingCost > 0 && car.clearingCost > 0
                      ? "Includes shipping & clearing"
                      : car.shippingCost > 0
                        ? "Includes shipping"
                        : car.clearingCost > 0
                          ? "Includes clearing"
                          : ""}
                  </p>
                )}

                {car.sold && (
                  <p className="text-sm text-red-600 font-semibold mt-2">
                    This car has been sold
                  </p>
                )}
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              <div className={specClass}>
                <div className={iconClass}>
                  <Tag className="w-4 h-4 text-blue-600" />
                </div>

                <div>
                  <p className={labelClass}>Brand</p>
                  <p className={valueClass}>{car.brandName}</p>
                </div>
              </div>

              <div className={specClass}>
                <div className={iconClass}>
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>

                <div>
                  <p className={labelClass}>Year</p>
                  <p className={valueClass}>{car.year}</p>
                </div>
              </div>

              {car.condition === "Used" && (
                <div className={specClass}>
                  <div className={iconClass}>
                    <Gauge className="w-4 h-4 text-blue-600" />
                  </div>

                  <div>
                    <p className={labelClass}>Mileage</p>
                    <p className={valueClass}>
                      {Number(car.mileage).toLocaleString()} km
                    </p>
                  </div>
                </div>
              )}

              <div className={specClass}>
                <div className={iconClass}>
                  {isNew ? (
                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                  ) : (
                    <CarIcon className="w-4 h-4 text-blue-600" />
                  )}
                </div>

                <div>
                  <p className={labelClass}>Condition</p>
                  <p className={valueClass}>{car.condition}</p>
                </div>
              </div>

              {car.shippingCost > 0 && (
                <div className={specClass}>
                  <div className={iconClass}>
                    <Ship className="w-4 h-4 text-blue-600" />
                  </div>

                  <div>
                    <p className={labelClass}>Shipping</p>
                    <p className={valueClass}>Included</p>
                  </div>
                </div>
              )}

              {car.clearingCost > 0 && (
                <div className={specClass}>
                  <div className={iconClass}>
                    <FileCheck className="w-4 h-4 text-blue-600" />
                  </div>

                  <div>
                    <p className={labelClass}>Clearing</p>
                    <p className={valueClass}>Included</p>
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp CTA */}
            {car.sold ? (
              <div className="flex items-center justify-center gap-2 bg-gray-200 text-gray-500 font-semibold py-4 rounded-xl cursor-not-allowed">
                <MessageCircle className="w-5 h-5" />
                Car Sold
              </div>
            ) : (
              <>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  Inquire on WhatsApp
                </a>

                <p className="text-xs text-gray-400 text-center -mt-3">
                  Ask about availability, inspection, or delivery
                </p>
              </>
            )}
          </motion.div>
        </div>

        {/* Reviews */}
        <CarReviews carId={car.id} />
      </div>
    </main>
  );
}
