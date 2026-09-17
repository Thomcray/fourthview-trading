"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Car as CarIcon } from "lucide-react";
import Banner from "@/components/ShopWithUs/Banner";
import CarConditionFilter, {
  CarCondition,
} from "@/components/Car/CarConditionFilter";
import CarConditionSection, {
  CarType,
} from "@/components/Car/CarConditionSection";
import carBanner from "@/public/carBanner.jpg";

const CONDITIONS: ("New" | "Used")[] = ["New", "Used"];

export default function CarsPage() {
  const searchParams = useSearchParams();
  const conditionParam = searchParams.get("condition");

  const initialCondition: "All Cars" | "New" | "Used" =
    conditionParam?.toLowerCase() === "new"
      ? "New"
      : conditionParam?.toLowerCase() === "used"
        ? "Used"
        : "All Cars";

  const [selected, setSelected] = useState<CarCondition>(initialCondition);
  const [cars, setCars] = useState<CarType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Keep selected filter in sync with the URL
  useEffect(() => {
    if (conditionParam?.toLowerCase() === "new") {
      setSelected("New");
    } else if (conditionParam?.toLowerCase() === "used") {
      setSelected("Used");
    } else {
      setSelected("All Cars");
    }
  }, [conditionParam]);

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load cars");
        return res.json();
      })
      .then((data) => setCars(data.cars || []))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const conditionsToShow = selected === "All Cars" ? CONDITIONS : [selected];

  const categoryIcons = {
    New: <BadgeCheck className="w-5 h-5" />,
    Used: <CarIcon className="w-5 h-5" />,
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Banner Section */}
      <Banner
        banner={carBanner}
        location={true}
        bannerText="Find Your Perfect Car"
      />

      {/* Condition Filter */}
      <div className="sticky top-12 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <CarConditionFilter selected={selected} onSelect={setSelected} />
        </div>
      </div>

      {/* Sections */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center py-20"
              >
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-12 sm:space-y-16"
              >
                {conditionsToShow.map((condition, index) => {
                  const filteredCars = cars.filter(
                    (c) =>
                      c.condition.toLowerCase() === condition.toLowerCase(),
                  );

                  return (
                    <motion.div
                      key={condition}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.5,
                      }}
                    >
                      {/* Section Header with Icon */}
                      <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-blue-100">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {categoryIcons[condition]}
                        </div>

                        <div>
                          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            {condition === "New" ? "New Cars" : "Used Cars"}
                          </h2>

                          <p className="text-sm text-gray-500 mt-1">
                            {condition === "New"
                              ? "Brand new, zero mileage vehicles"
                              : "Pre-owned cars in great condition"}
                          </p>
                        </div>
                      </div>

                      <CarConditionSection
                        condition={condition}
                        cars={filteredCars}
                        hideWhenEmpty={selected === "All Cars"}
                      />
                    </motion.div>
                  );
                })}

                {!isLoading && cars.length === 0 && (
                  <div className="text-center py-20">
                    <CarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />

                    <p className="text-gray-500">No cars available yet</p>

                    <p className="text-sm text-gray-400 mt-1">
                      Check back soon for new listings
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
