// components/Admin/AddProduct/ProductForm.tsx
"use client";

import React, {
  useState,
  useTransition,
  createContext,
  useContext,
  useCallback,
  useRef, // ADDED
} from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/app/_lib/actions/product-actions";
import GeneralInformation from "./GeneralInformation";
import ProductMedia from "./ProductMedia";
import Pricing from "./Pricing";
import OtherInformation from "./OtherInformation";
import AvailableColours from "./AvailableColours";
import Category from "./Category";
import {
  AlertCircle,
  PackagePlus,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormDataContextType {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  colours: string[];
  setColours: (colours: string[]) => void;
  images: File[];
  setImages: (images: File[]) => void;
  productType: string;
  setProductType: (type: string) => void;
  customType: string;
  setCustomType: (type: string) => void;
  finalProductType: string;
  // NEW: Category state lifted to context
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedTarget: string;
  setSelectedTarget: (target: string) => void;
}

const FormDataContext = createContext<FormDataContextType | null>(null);

export const useFormData = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error("useFormData must be used within ProductForm");
  }
  return context;
};

export default function ProductForm() {
  const [colours, setColours] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [productType, setProductType] = useState("");
  const [customType, setCustomType] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  // Lift category state to parent so it persists across steps
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");

  // Use ref to track if we're actually on step 5 for submission
  const hasReachedStep5 = useRef(false);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    discount: "",
    discountType: "",
    target: "",
    weight: "",
    shippingCost: "",
    sizes: [] as string[],
  });

  const updateFormData = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const finalProductType = productType === "Custom" ? customType : productType;

  const steps = [
    { id: 1, name: "General Info", description: "Basic product details" },
    { id: 2, name: "Media", description: "Product images" },
    { id: 3, name: "Type", description: "Select product type" },
    { id: 4, name: "Category", description: "Category & target audience" },
    { id: 5, name: "Details", description: "Size, weight, shipping & pricing" },
  ];

  const validateCurrentStep = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.productName.trim()) {
          toast.error("Please enter product name");
          return false;
        }
        if (!formData.description.trim()) {
          toast.error("Please enter product description");
          return false;
        }
        break;

      case 2:
        if (images.length === 0) {
          toast.error("Please upload at least one product image");
          return false;
        }
        break;

      case 3:
        if (!productType) {
          toast.error("Please select a product type");
          return false;
        }
        if (productType === "Custom" && !customType.trim()) {
          toast.error("Please enter a custom product type name");
          return false;
        }
        break;

      case 4:
        // Check lifted state instead of DOM
        if (!selectedCategory) {
          toast.error("Please select a category");
          return false;
        }
        break;

      case 5:
        if (!formData.price) {
          toast.error("Please enter product price");
          return false;
        }
        break;
    }

    return true;
  }, [
    currentStep,
    formData,
    images,
    productType,
    customType,
    selectedCategory,
  ]);

  const handleProduct = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isPending) return;
      if (currentStep !== 5) {
        toast.error("Please complete all steps before publishing");
        return;
      }
      if (!validateCurrentStep()) return;

      const form = e.currentTarget;
      const formDataObj = new FormData(form);

      // Only need to append complex data not in hidden inputs
      formDataObj.append("colours", JSON.stringify(colours));

      startTransition(async () => {
        try {
          await createProduct(formDataObj, colours, images);
          toast.success("Product created successfully!");
          form.reset();
          setFormData({
            productName: "",
            description: "",
            price: "",
            discount: "",
            discountType: "",
            target: "",
            weight: "",
            shippingCost: "",
            sizes: [],
          });
          setColours([]);
          setImages([]);
          setProductType("");
          setCustomType("");
          setSelectedCategory("");
          setSelectedTarget("");
          setError("");
          setCurrentStep(1);
          setIsReadyToSubmit(false);
          hasReachedStep5.current = false;
        } catch (error) {
          setError((error as Error).message);
          toast.error((error as Error).message);
        }
      });
    },
    [isPending, currentStep, colours, images, validateCurrentStep],
  );

  const handleDiscard = useCallback(() => {
    if (
      confirm(
        "Are you sure you want to discard all changes? This action cannot be undone.",
      )
    ) {
      setFormData({
        productName: "",
        description: "",
        price: "",
        discount: "",
        discountType: "",
        target: "",
        weight: "",
        shippingCost: "",
        sizes: [],
      });
      setColours([]);
      setImages([]);
      setProductType("");
      setCustomType("");
      setSelectedCategory("");
      setSelectedTarget("");
      setError("");
      setCurrentStep(1);
      setIsReadyToSubmit(false);
      hasReachedStep5.current = false;
      toast.info("Form has been cleared");
    }
  }, []);

  const handleNext = useCallback(() => {
    if (!validateCurrentStep()) return;
    if (currentStep < steps.length) {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep === 5) {
          hasReachedStep5.current = true;
          setIsReadyToSubmit(true);
        }
        return nextStep;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, validateCurrentStep, steps.length]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      if (currentStep <= 5) {
        setIsReadyToSubmit(false);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const contextValue = {
    formData,
    updateFormData,
    colours,
    setColours,
    images,
    setImages,
    productType,
    setProductType,
    customType,
    setCustomType,
    finalProductType,
    selectedCategory,
    setSelectedCategory,
    selectedTarget,
    setSelectedTarget,
  };

  return (
    <FormDataContext.Provider value={contextValue}>
      <form className="flex flex-col gap-6" onSubmit={handleProduct}>
        {/* Header - FIXED: Remove any submit button from header */}
        <div className="sticky top-0 z-10 bg-white border mt-4 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Add New Product
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Step {currentStep} of {steps.length}:{" "}
                  {steps[currentStep - 1].name}
                </p>
              </div>
              {/* Discard button */}
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
                      onClick={() => {
                        if (step.id <= currentStep) {
                          setCurrentStep(step.id);
                        }
                      }}
                      disabled={step.id > currentStep}
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        transition-all duration-200
                        ${
                          currentStep === step.id
                            ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-100"
                            : currentStep > step.id
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }
                      `}
                    >
                      {currentStep > step.id ? "✓" : step.id}
                    </button>
                    <span className="text-xs text-gray-500 mt-1 hidden sm:block">
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gray-200 mx-2">
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
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
                type="button"
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
                  <ProductTypeStep
                    productType={productType}
                    customType={customType}
                    onTypeChange={setProductType}
                    onCustomTypeChange={setCustomType}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6">
                  <Category
                    productType={finalProductType}
                    isCustom={productType === "Custom"}
                  />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 space-y-8">
                  {/* HIDDEN INPUTS: All data from previous steps */}
                  <input
                    type="hidden"
                    name="productName"
                    value={formData.productName}
                  />
                  <input
                    type="hidden"
                    name="description"
                    value={formData.description}
                  />
                  <input type="hidden" name="type" value={finalProductType} />
                  <input
                    type="hidden"
                    name="category"
                    value={selectedCategory}
                  />
                  {selectedTarget && (
                    <input type="hidden" name="target" value={selectedTarget} />
                  )}

                  {/* Current step content */}
                  <OtherInformation
                    productType={finalProductType}
                    isCustom={productType === "Custom"}
                    isUpdatePage={false}
                  >
                    <AvailableColours
                      colours={colours}
                      setColours={setColours}
                    />
                  </OtherInformation>

                  <div className="border-t pt-6">
                    <Pricing />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* FIX: Navigation buttons with proper types */}
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

          {/* Only show Publish on step 5, and use proper type */}
          {currentStep === 5 ? (
            <Button
              type="submit"
              disabled={isPending || !isReadyToSubmit}
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
          ) : (
            <Button
              type="button" // EXPLICITLY button, not submit
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ChevronRight className="w-4 h-4" />
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
    </FormDataContext.Provider>
  );
}

// Product Type Step Component
function ProductTypeStep({
  productType,
  customType,
  onTypeChange,
  onCustomTypeChange,
}: {
  productType: string;
  customType: string;
  onTypeChange: (type: string) => void;
  onCustomTypeChange: (custom: string) => void;
}) {
  const PREDEFINED_TYPES = [
    { id: "Shirt", label: "Shirt", icon: "👕", category: "Fashion" },
    { id: "Trouser", label: "Trouser", icon: "👖", category: "Fashion" },
    { id: "Shoes", label: "Shoes", icon: "👟", category: "Fashion" },
    { id: "Jewelry", label: "Jewelry", icon: "💍", category: "Fashion" },
    { id: "Furniture", label: "Furniture", icon: "🪑", category: "Home" },
    { id: "Custom", label: "Other / Custom", icon: "✨", category: "Custom" },
  ] as const;

  const isCustom = productType === "Custom";

  const handleTypeSelect = (typeId: string) => {
    onTypeChange(typeId);
    if (typeId !== "Custom") {
      onCustomTypeChange("");
    }
  };

  const selectedType = PREDEFINED_TYPES.find((t) => t.id === productType);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium text-slate-800">Product Type</h2>
        <p className="text-xs text-slate-400">
          Select a predefined type or enter a custom one for specialized
          products like Washing Machines, Electronics, etc.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {PREDEFINED_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => handleTypeSelect(type.id)}
            className={`
              relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 
              transition-all duration-200 text-left
              ${
                productType === type.id
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            <span className="text-2xl">{type.icon}</span>
            <div className="text-center">
              <span className="font-medium block">{type.label}</span>
              <span className="text-xs text-gray-400">{type.category}</span>
            </div>
            {productType === type.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {isCustom && (
        <div className="flex flex-col gap-3 p-6 bg-purple-50 rounded-xl border border-purple-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="text-sm font-medium text-purple-900">
            Enter Custom Product Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={customType}
            onChange={(e) => onCustomTypeChange(e.target.value)}
            placeholder="e.g., Washing Machine, Refrigerator, Camera, Bicycle..."
            className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            autoFocus
          />
          <div className="flex flex-wrap gap-2 text-xs text-purple-700">
            <span className="font-medium">Examples:</span>
            {[
              "Washing Machine",
              "Refrigerator",
              "Microwave",
              "Air Conditioner",
              "Camera",
              "Bicycle",
              "Gaming Console",
            ].map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => onCustomTypeChange(ex)}
                className="px-2 py-1 bg-purple-100 hover:bg-purple-200 rounded transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {productType && !isCustom && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <p className="text-sm text-green-800">
            <span className="font-medium">Selected:</span> {selectedType?.label}
          </p>
          <p className="text-xs text-green-600 mt-1">
            This type has predefined size options and category settings.
          </p>
        </div>
      )}

      {isCustom && customType && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <p className="text-sm text-purple-800">
            <span className="font-medium">Custom Type:</span> {customType}
          </p>
          <p className="text-xs text-purple-600 mt-1">
            You&apos;ll configure category and specifications manually in the
            next steps.
          </p>
        </div>
      )}
    </div>
  );
}
