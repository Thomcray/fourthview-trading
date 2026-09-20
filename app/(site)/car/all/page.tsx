"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Car as CarIcon, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import ProductPrice from "@/components/ProductPrice";
import { getPublicImageUrl } from "@/lib/images";
import type { CarType } from "@/components/Car/CarConditionSection";

type SortOption = "default" | "price-asc" | "price-desc" | "year-desc";

const CARS_PER_PAGE = 8;

export default function AllCarsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const conditionParam = searchParams.get("condition");

  const [cars, setCars] = useState<CarType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [visibleCount, setVisibleCount] = useState(CARS_PER_PAGE);

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load cars");
        }

        return res.json();
      })
      .then((data) => {
        setCars(data.cars || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Filter by condition
  const filteredCars = useMemo(() => {
    if (!conditionParam) {
      return cars;
    }

    return cars.filter(
      (car) => car.condition.toLowerCase() === conditionParam.toLowerCase(),
    );
  }, [cars, conditionParam]);

  // Sort cars
  const sortedCars = useMemo(() => {
    const result = [...filteredCars];

    switch (sortBy) {
      case "price-asc":
        return result.sort((a, b) => a.totalPrice - b.totalPrice);

      case "price-desc":
        return result.sort((a, b) => b.totalPrice - a.totalPrice);

      case "year-desc":
        return result.sort((a, b) => b.year - a.year);

      default:
        return result;
    }
  }, [filteredCars, sortBy]);

  // Only display the number of cars allowed by Load More
  const visibleCars = sortedCars.slice(0, visibleCount);

  const hasMoreCars = visibleCount < sortedCars.length;

  const title =
    conditionParam?.toLowerCase() === "new"
      ? "New Cars"
      : conditionParam?.toLowerCase() === "used"
        ? "Used Cars"
        : "All Cars";

  const description =
    conditionParam?.toLowerCase() === "new"
      ? "Explore our collection of brand new vehicles"
      : conditionParam?.toLowerCase() === "used"
        ? "Explore our collection of quality pre-owned vehicles"
        : "Explore our complete collection of vehicles";

  // Reset Load More when condition changes
  useEffect(() => {
    setVisibleCount(CARS_PER_PAGE);
  }, [conditionParam]);

  const handleLoadMore = () => {
    setVisibleCount((current) =>
      Math.min(current + CARS_PER_PAGE, sortedCars.length),
    );
  };

  const handleConditionChange = (condition: "all" | "new" | "used") => {
    if (condition === "all") {
      router.push("/car/all");
    } else {
      router.push(`/car/all?condition=${condition}`);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-linear-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-48 sm:h-56 bg-gray-200" />

                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-5 bg-gray-200 rounded w-1/2 mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-linear-to-br from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <CarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />

          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to Load Cars
          </h2>

          <p className="text-red-500 mb-6">{error}</p>

          <Button
            onClick={() => router.push("/car")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Back to Cars
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-blue-900 to-blue-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/car"
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cars
          </Link>

          <div className="text-center">
            <div className="flex justify-center mb-3">
              {conditionParam?.toLowerCase() === "new" ? (
                <BadgeCheck className="w-10 h-10 text-white" />
              ) : (
                <CarIcon className="w-10 h-10 text-white" />
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {title}
            </h1>

            <p className="text-blue-100 max-w-2xl mx-auto">{description}</p>

            <div className="inline-block mt-4 px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              {filteredCars.length} {filteredCars.length === 1 ? "Car" : "Cars"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-200">
          {/* Condition Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={!conditionParam ? "default" : "outline"}
              onClick={() => handleConditionChange("all")}
              className={!conditionParam ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              All Cars
            </Button>

            <Button
              variant={
                conditionParam?.toLowerCase() === "new" ? "default" : "outline"
              }
              onClick={() => handleConditionChange("new")}
              className={
                conditionParam?.toLowerCase() === "new"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : ""
              }
            >
              New Cars
            </Button>

            <Button
              variant={
                conditionParam?.toLowerCase() === "used" ? "default" : "outline"
              }
              onClick={() => handleConditionChange("used")}
              className={
                conditionParam?.toLowerCase() === "used"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : ""
              }
            >
              Used Cars
            </Button>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Newest Year</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {sortedCars.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">
              Showing {visibleCars.length} of {sortedCars.length}{" "}
              {sortedCars.length === 1 ? "car" : "cars"}
            </p>
          </div>
        )}

        {/* Empty State */}
        {sortedCars.length === 0 ? (
          <div className="text-center py-20">
            <CarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />

            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No cars found
            </h3>

            <p className="text-gray-500 mb-6">
              There are no cars available in this selection yet.
            </p>

            <Button
              onClick={() => handleConditionChange("all")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              View All Cars
            </Button>
          </div>
        ) : (
          <>
            {/* Car Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {visibleCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: car.sold ? 0 : -5 }}
                  className={`group/car bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${
                    car.sold ? "opacity-80" : ""
                  }`}
                >
                  <Link href={`/car/${car.id}`}>
                    {/* Car Image */}
                    <div className="relative bg-gray-100 h-48 sm:h-56 overflow-hidden">
                      {car.imageUrl?.[0] ? (
                        <Image
                          src={getPublicImageUrl(car.imageUrl[0])}
                          alt={`${car.year} ${car.brandName}`}
                          fill
                          className={`object-cover transition-transform duration-500 ${
                            car.sold ? "grayscale" : "group-hover/car:scale-105"
                          }`}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                          <CarIcon className="w-10 h-10 text-gray-400" />
                        </div>
                      )}

                      {/* Sold Overlay */}
                      {car.sold && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-[5]">
                          <div className="bg-red-600 text-white font-bold text-sm sm:text-base px-5 py-2 rounded-lg shadow-lg rotate-[-8deg]">
                            SOLD
                          </div>
                        </div>
                      )}

                      {/* Quick View Overlay */}
                      {!car.sold && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/car:opacity-100 transition-opacity duration-300">
                          <div className="bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-full transform translate-y-4 group-hover/car:translate-y-0 transition-all duration-300">
                            View Details
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Car Info */}
                    <div className="p-4">
                      <h3
                        className={`font-semibold text-sm sm:text-base truncate transition-colors ${
                          car.sold
                            ? "text-gray-500"
                            : "text-gray-800 group-hover/car:text-blue-600"
                        }`}
                      >
                        {car.brandName}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {car.year}
                        {car.condition.toLowerCase() === "used" &&
                          ` • ${car.mileage.toLocaleString()} km`}
                      </p>

                      <div className="mt-2">
                        <p
                          className={`text-lg font-bold ${
                            car.sold
                              ? "text-gray-400 line-through"
                              : "text-blue-900"
                          }`}
                        >
                          <ProductPrice yuanPrice={car.totalPrice} />
                        </p>

                        {!car.sold && (
                          <p className="text-xs text-gray-400">
                            (incl. shipping &amp; clearing)
                          </p>
                        )}
                      </div>

                      {/* Sold Status */}
                      {car.sold && (
                        <div className="mt-2 flex items-center gap-1.5 text-red-600">
                          <BadgeCheck className="w-4 h-4" />

                          <span className="text-xs font-semibold">
                            This car has been sold
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {hasMoreCars && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 cursor-pointer"
                >
                  Load More Cars
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
