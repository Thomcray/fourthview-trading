"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { updateCar } from "@/app/_lib/actions/car-actions";
import ProductMedia from "@/components/Admin/AddProduct/ProductMedia"; // adjust path
import { AlertCircle, Car, Save, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CarType = {
  id: number;
  brandName: string;
  year: number;
  condition: string;
  mileage: number;
  price: number;
  shippingCost: number;
  clearingCost: number;
  totalPrice: number;
  imageUrl: string[];
};

export default function UpdateCarForm({ car }: { car: CarType }) {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    car?.imageUrl || [],
  );
  const [condition, setCondition] = useState<"New" | "Used">(
    (car?.condition as "New" | "Used") || "New",
  );
  const [price, setPrice] = useState(car?.price?.toString() || "");
  const [shippingCost, setShippingCost] = useState(
    car?.shippingCost?.toString() || "",
  );
  const [clearingCost, setClearingCost] = useState(
    car?.clearingCost?.toString() || "",
  );
  const [brandName, setBrandName] = useState(car?.brandName || "");
  const [year, setYear] = useState(car?.year?.toString() || "");
  const [mileage, setMileage] = useState(car?.mileage?.toString() || "");
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentYear = new Date().getFullYear();

  const totalPrice =
    (Number(price) || 0) +
    (Number(shippingCost) || 0) +
    (Number(clearingCost) || 0);

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all";

  const handleUpdate = () => {
    if (isPending || isSubmitting) return;

    // Validation
    if (!brandName.trim()) {
      toast.error("Please enter the brand name");
      return;
    }
    if (!year) {
      toast.error("Please enter the year");
      return;
    }
    if (condition === "Used" && !mileage) {
      toast.error("Please enter the mileage for a used car");
      return;
    }
    if (!price) {
      toast.error("Please enter the car price");
      return;
    }
    if (!shippingCost) {
      toast.error("Please enter the shipping cost");
      return;
    }
    if (!clearingCost) {
      toast.error("Please enter the clearing cost");
      return;
    }
    if (images.length === 0 && existingImages.length === 0) {
      toast.error("Please keep at least one car image");
      return;
    }

    setIsSubmitting(true);

    // Build FormData from state (same approach as your UpdateForm)
    const formDataObj = new FormData();
    formDataObj.append("brandName", brandName);
    formDataObj.append("year", year);
    formDataObj.append("condition", condition);
    formDataObj.append("mileage", condition === "New" ? "0" : mileage);
    formDataObj.append("price", price);
    formDataObj.append("shippingCost", shippingCost);
    formDataObj.append("clearingCost", clearingCost);
    formDataObj.append("totalPrice", String(totalPrice));
    formDataObj.append("existingImages", JSON.stringify(existingImages));

    startTransition(async () => {
      try {
        await updateCar(car.id, formDataObj, images);
        toast.success("Car updated successfully!");
        router.push("/admin/view-cars");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An error occurred";
        setError(message);
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const handleDiscard = () => {
    if (confirm("Are you sure you want to discard all changes?")) {
      router.push("/admin/view-cars");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-white border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Edit Car</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {car.year} {car.brandName} — #{car.id}
            </p>
          </div>
          <Button
            variant="outline"
            type="button"
            onClick={handleDiscard}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 w-fit"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-6 pb-6 space-y-8">
          {/* Images */}
          <div>
            <h2 className="text-base font-medium text-slate-800 mb-1">
              Car Images
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Add new photos, or remove existing ones
            </p>
            <ProductMedia
              images={images}
              setImages={setImages}
              existingImages={existingImages}
            />
          </div>

          {/* Brand & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g., Toyota, Mercedes-Benz, Honda"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1950"
                max={currentYear + 1}
                placeholder={`e.g., ${currentYear}`}
                className={inputClass}
              />
            </div>
          </div>

          {/* Condition */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Condition <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {(["New", "Used"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={`
                    relative flex items-center justify-center gap-2 p-4 rounded-xl border-2
                    transition-all duration-200
                    ${
                      condition === c
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600"
                    }
                  `}
                >
                  <Car className="w-4 h-4" />
                  <span className="font-medium">{c}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mileage */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Mileage (km){" "}
              {condition === "Used" && <span className="text-red-500">*</span>}
              {condition === "New" && (
                <span className="text-xs text-gray-400 font-normal">
                  (not applicable for new cars)
                </span>
              )}
            </label>
            <input
              type="number"
              value={condition === "New" ? "0" : mileage}
              onChange={(e) => setMileage(e.target.value)}
              min="0"
              placeholder={condition === "New" ? "0" : "e.g., 45000"}
              disabled={condition === "New"}
              className={`${inputClass} ${
                condition === "New" ? "bg-gray-100 text-gray-400" : ""
              }`}
            />
          </div>

          {/* Price breakdown */}
          <div>
            <h2 className="text-base font-medium text-slate-800 mb-4">
              Pricing
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">
                  Car Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="e.g., 20000"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">
                  Shipping Cost <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="e.g., 2500"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">
                  Clearing Cost <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={clearingCost}
                  onChange={(e) => setClearingCost(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="e.g., 1500"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Live total */}
          <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-6 py-4">
            <div>
              <p className="text-sm font-medium text-blue-900">
                Total Buyer Price
              </p>
              <p className="text-xs text-blue-600">
                What the customer pays — price + shipping + clearing
              </p>
            </div>
            <p className="text-2xl font-bold text-blue-700">
              ${totalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end gap-4 px-6 pb-6 border-t border-gray-100 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleDiscard}
            disabled={isPending || isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpdate}
            disabled={isPending || isSubmitting}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-8"
          >
            {isPending || isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
