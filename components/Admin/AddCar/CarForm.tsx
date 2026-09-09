"use client";

import React, { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { createCar } from "@/app/_lib/actions/car-actions";
import ProductMedia from "@/components/Admin/AddProduct/ProductMedia"; // adjust path if needed
import { AlertCircle, Car, Trash2, X, PackagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CarForm() {
  const [images, setImages] = useState<File[]>([]);
  const [condition, setCondition] = useState<"New" | "Used">("New");
  const [price, setPrice] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [clearingCost, setClearingCost] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const currentYear = new Date().getFullYear();

  const totalPrice =
    (Number(price) || 0) +
    (Number(shippingCost) || 0) +
    (Number(clearingCost) || 0);

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all";

  const resetForm = (form?: HTMLFormElement) => {
    form?.reset();
    setImages([]);
    setCondition("New");
    setPrice("");
    setShippingCost("");
    setClearingCost("");
    setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;

    const form = e.currentTarget;
    const formDataObj = new FormData(form);

    // Client-side validation
    if (images.length === 0) {
      toast.error("Please upload at least one car image");
      return;
    }
    if (!formDataObj.get("brandName")) {
      toast.error("Please enter the brand name");
      return;
    }
    if (!formDataObj.get("year")) {
      toast.error("Please enter the year");
      return;
    }
    if (condition === "Used" && !formDataObj.get("mileage")) {
      toast.error("Please enter the mileage for a used car");
      return;
    }
    if (!formDataObj.get("price")) {
      toast.error("Please enter the car price");
      return;
    }
    if (!formDataObj.get("shippingCost")) {
      toast.error("Please enter the shipping cost");
      return;
    }
    if (!formDataObj.get("clearingCost")) {
      toast.error("Please enter the clearing cost");
      return;
    }

    formDataObj.append("condition", condition);
    formDataObj.append("totalPrice", String(totalPrice));
    if (condition === "New") {
      formDataObj.set("mileage", "0");
    }

    startTransition(async () => {
      try {
        await createCar(formDataObj, images);
        toast.success("Car listed successfully!");
        resetForm(form);
      } catch (err) {
        setError((err as Error).message);
        toast.error((err as Error).message);
      }
    });
  };

  const handleDiscard = () => {
    if (
      confirm(
        "Are you sure you want to discard all changes? This action cannot be undone.",
      )
    ) {
      const form = document.getElementById("car-form") as HTMLFormElement;
      resetForm(form);
      toast.info("Form has been cleared");
    }
  };

  return (
    <form id="car-form" className="flex flex-col gap-6" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="bg-white border mt-4 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Add New Car</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              List a car for sale with photos and details
            </p>
          </div>
          <Button
            variant="outline"
            type="button"
            onClick={handleDiscard}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors w-fit"
          >
            <Trash2 className="w-4 h-4" />
            Discard
          </Button>
        </div>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
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

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 space-y-8">
          {/* Images */}
          <div>
            <h2 className="text-base font-medium text-slate-800 mb-1">
              Car Images
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Upload at least one photo of the car
            </p>
            <ProductMedia
              images={images}
              setImages={setImages}
              existingImages={[]}
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
                name="brandName"
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
                name="year"
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
                    transition-all duration-200 cursor-pointer
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

          {/* Mileage (only for used cars) */}
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
              name="mileage"
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
                  name="price"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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
                  name="shippingCost"
                  min="0"
                  step="0.01"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
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
                  name="clearingCost"
                  min="0"
                  step="0.01"
                  value={clearingCost}
                  onChange={(e) => setClearingCost(e.target.value)}
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
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-8 cursor-pointer"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <PackagePlus className="w-4 h-4" />
              Publish Car
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
