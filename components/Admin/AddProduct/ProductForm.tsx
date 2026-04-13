"use client";

import React, { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/app/_lib/actions/product-actions";
import GeneralInformation from "./GeneralInformation";
import ProductMedia from "./ProductMedia";
import Pricing from "./Pricing";
import OtherInformation from "./OtherInformation";
import AvailableColours from "./AvailableColours";
import {
  AlertCircle,
  PackagePlus,
  Trash2,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductFormProps {
  children: React.ReactNode | ((productType: string) => React.ReactNode);
}

export default function ProductForm({ children }: ProductFormProps) {
  const [productType, setProductType] = useState("");
  const [colours, setColours] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [formProgress, setFormProgress] = useState(0);

  const steps = [
    { id: 1, name: "General Info", description: "Basic product details" },
    { id: 2, name: "Media", description: "Product images" },
    { id: 3, name: "Details", description: "Size, colors, etc." },
    { id: 4, name: "Pricing", description: "Price & category" },
  ];

  const handleProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);

    // Validate required fields
    const productName = formData.get("productName");
    const price = formData.get("price");

    if (!productName) {
      toast.error("Please enter product name");
      return;
    }
    if (!price) {
      toast.error("Please enter product price");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    startTransition(async () => {
      try {
        await createProduct(formData, colours, images);
        toast.success("Product created successfully!");
        form.reset();
        setColours([]);
        setImages([]);
        setError("");
        setCurrentStep(1);
        setFormProgress(0);
      } catch (error) {
        setError((error as Error).message);
        toast.error((error as Error).message);
      }
    });
  };

  const handleDiscard = () => {
    if (
      confirm(
        "Are you sure you want to discard all changes? This action cannot be undone.",
      )
    ) {
      setColours([]);
      setImages([]);
      setError("");
      setCurrentStep(1);
      setFormProgress(0);
      const form = document.querySelector("form");
      form?.reset();
      toast.info("Form has been cleared");
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setFormProgress((currentStep / steps.length) * 100);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setFormProgress(((currentStep - 2) / steps.length) * 100);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleProduct}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border mt-4 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Add New Product
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Fill in the details below to list a new product
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={handleDiscard}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Discard
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Publish Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-3 bg-white border-b">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      transition-all duration-200
                      ${
                        currentStep >= step.id
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                      }
                    `}
                  >
                    {step.id}
                  </button>
                  <span className="text-xs text-gray-500 mt-1 hidden sm:block">
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200 mx-2">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: currentStep > step.id ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
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
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-6">
                <GeneralInformation />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-6">
                <ProductMedia
                  images={images}
                  setImages={setImages}
                  existingImages={[]}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-6">
                <OtherInformation
                  isUpdatePage={false}
                  onTypeChange={setProductType}
                >
                  <AvailableColours colours={colours} setColours={setColours} />
                </OtherInformation>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Pricing />
                  <div className="border-l lg:border-l lg:pl-8">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">
                      Category Selection
                    </h3>
                    {typeof children === "function"
                      ? children(productType)
                      : children}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <PackagePlus className="w-4 h-4" />
                Publish Product
              </>
            )}
          </Button>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg px-4 py-2 border">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">Progress</div>
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
          <div className="text-sm font-medium text-blue-600">
            {Math.round((currentStep / steps.length) * 100)}%
          </div>
        </div>
      </div>
    </form>
  );
}
