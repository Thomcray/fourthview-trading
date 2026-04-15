"use client";

import React, {
  useState,
  useTransition,
  useCallback,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { updateProduct } from "@/app/_lib/actions/update-product-action";
import UpdateGeneralInformation from "./UpdateGeneralInformation";

import {
  AlertCircle,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UpdateAvailableColours from "./UpdateAvailableColors";
import UpdateProductMedia from "./UpdateProductMedia";
import UpdateCategory from "./UpdateCategory";
import UpdateOtherInformation from "./UpdateOtherInformation";
import UpdatePricing from "./UpdatePricing";

// Define form data type
type FormDataType = {
  productName: string;
  description: string;
  price: string;
  discount: string;
  discountType: string;
  target: string;
  weight: string;
  shippingCost: string;
  sizes: string[];
};

// Define category type
type Category = {
  id: number;
  name: string;
  [key: string]: unknown;
};

// Create UpdateForm's own context
interface UpdateFormContextType {
  formData: FormDataType;
  updateFormData: (field: keyof FormDataType, value: string | string[]) => void;
  colours: string[];
  setColours: (colours: string[]) => void;
  images: File[];
  setImages: (images: File[]) => void;
  existingImages: string[];
  setExistingImages: (images: string[]) => void;
  productType: string;
  setProductType: (type: string) => void;
  customType: string;
  setCustomType: (type: string) => void;
  finalProductType: string;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedTarget: string;
  setSelectedTarget: (target: string) => void;
  product: Product | null;
}

const UpdateFormContext = createContext<UpdateFormContextType | null>(null);

export const useUpdateForm = () => {
  const context = useContext(UpdateFormContext);
  if (!context) {
    throw new Error("useUpdateForm must be used within UpdateForm");
  }
  return context;
};

// Export for use in child components
export { UpdateFormContext };

type Product = {
  id: number;
  name: string;
  description: string;
  productType: string;
  colours: string[];
  price: number;
  discount: number;
  discountType: string;
  categoryId: number;
  target: string;
  imageUrl: string[];
  sizes: string[];
  weight: string;
  shippingCost: number;
};

type UpdateFormProps = {
  product: Product;
};

export default function UpdateForm({ product }: UpdateFormProps) {
  const router = useRouter();
  const [colours, setColours] = useState<string[]>(product?.colours || []);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.imageUrl || [],
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({
    productName: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    discount: product?.discount?.toString() || "",
    discountType: product?.discountType || "",
    target: product?.target || "",
    weight: product?.weight || "",
    shippingCost: product?.shippingCost?.toString() || "",
    sizes: product?.sizes || ([] as string[]),
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTarget, setSelectedTarget] = useState(product?.target || "");
  const [productType, setProductType] = useState(product?.productType || "");
  const [customType, setCustomType] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  const updateFormData = useCallback(
    (field: keyof FormDataType, value: string | string[]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const finalProductType = productType === "Custom" ? customType : productType;

  const steps = [
    { id: 1, name: "General Info", description: "Basic product details" },
    { id: 2, name: "Media", description: "Product images" },
    { id: 3, name: "Type", description: "Select product type" },
    { id: 4, name: "Category", description: "Category & target audience" },
    { id: 5, name: "Details", description: "Size, weight, shipping & pricing" },
  ];

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories || []);
        if (product && d.categories) {
          const defaultCat = d.categories.find(
            (c: Category) => c.id === product.categoryId,
          );
          if (defaultCat) {
            setSelectedCategory(defaultCat.name);
          }
        }
      })
      .catch(() => {});
  }, [product]);

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
        if (images.length === 0 && existingImages.length === 0) {
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
    existingImages,
    productType,
    customType,
    selectedCategory,
  ]);

  const handleUpdate = useCallback(
    async (e?: React.FormEvent<HTMLDivElement>) => {
      // CRITICAL: Prevent any default form submission
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Prevent multiple submissions
      if (isPending || isSubmitting || hasSubmitted) return;

      // Only allow save on step 5
      if (currentStep !== 5) {
        toast.error("Please complete all steps before saving");
        return;
      }

      // Validate all required fields
      if (!formData.price) {
        toast.error("Please enter product price");
        return;
      }
      if (!formData.productName.trim()) {
        toast.error("Please enter product name");
        return;
      }
      if (!formData.description.trim()) {
        toast.error("Please enter product description");
        return;
      }
      if (images.length === 0 && existingImages.length === 0) {
        toast.error("Please upload at least one product image");
        return;
      }
      if (!productType) {
        toast.error("Please select a product type");
        return;
      }
      if (productType === "Custom" && !customType.trim()) {
        toast.error("Please enter a custom product type name");
        return;
      }
      if (!selectedCategory) {
        toast.error("Please select a category");
        return;
      }

      setIsSubmitting(true);
      setHasSubmitted(true);

      // Build FormData from state
      const formDataObj = new FormData();
      formDataObj.append("productName", formData.productName);
      formDataObj.append("description", formData.description);
      formDataObj.append("type", finalProductType);
      formDataObj.append("category", selectedCategory);
      if (selectedTarget) {
        formDataObj.append("target", selectedTarget);
      }
      formDataObj.append("price", formData.price);
      formDataObj.append("discount", formData.discount || "0");
      formDataObj.append("discountType", formData.discountType || "");
      formDataObj.append("weight", formData.weight || "");
      formDataObj.append("shippingCost", formData.shippingCost || "");
      formDataObj.append("colours", JSON.stringify(colours));
      formDataObj.append("productId", String(product?.id));
      formDataObj.append("existingImages", JSON.stringify(existingImages));

      images.forEach((image) => {
        formDataObj.append("images", image);
      });

      startTransition(async () => {
        try {
          if (product) {
            await updateProduct(product.id, formDataObj, colours, images);
            toast.success("Product updated successfully!");
            router.push("/admin/view-products");
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "An error occurred";
          setError(errorMessage);
          toast.error(errorMessage);
          // Reset submission state on error so user can retry
          setHasSubmitted(false);
        } finally {
          setIsSubmitting(false);
        }
      });
    },
    [
      isPending,
      isSubmitting,
      hasSubmitted,
      currentStep,
      colours,
      images,
      product,
      router,
      formData,
      existingImages,
      finalProductType,
      selectedCategory,
      selectedTarget,
      productType,
      customType,
    ],
  );

  const handleDiscard = useCallback(() => {
    if (confirm("Are you sure you want to discard all changes?")) {
      router.push("/admin/view-products");
    }
  }, [router]);

  const handleNext = useCallback(() => {
    if (!validateCurrentStep()) return;
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, validateCurrentStep, steps.length]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const contextValue: UpdateFormContextType = {
    formData,
    updateFormData,
    colours,
    setColours,
    images,
    setImages,
    existingImages,
    setExistingImages,
    productType,
    setProductType,
    customType,
    setCustomType,
    finalProductType,
    selectedCategory,
    setSelectedCategory,
    selectedTarget,
    setSelectedTarget,
    product,
  };

  if (!product) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Product not found.</p>
          <Button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <UpdateFormContext.Provider value={contextValue}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* CRITICAL: Use div instead of form to prevent ANY native form submission */}
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Edit Product
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Step {currentStep} of {steps.length}:{" "}
                  {steps[currentStep - 1].name}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleDiscard}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
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

          {/* Step Content */}
          <div className="px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && (
                  <div className="py-6">
                    <UpdateGeneralInformation />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="py-6">
                    <UpdateProductMedia />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="py-6">
                    <ProductTypeStep />
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="py-6">
                    <UpdateCategory />
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="py-6 space-y-8">
                    <UpdateOtherInformation>
                      <UpdateAvailableColours />
                    </UpdateOtherInformation>

                    <div className="border-t pt-6">
                      <UpdatePricing />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 pt-2 pb-6 px-6 border-t border-gray-100">
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

            {currentStep === 5 ? (
              <Button
                type="button" // CRITICAL: Explicitly button type, not submit
                onClick={() => handleUpdate()}
                disabled={isPending || isSubmitting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
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
            ) : (
              <Button
                type="button"
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
        </div>
      </div>
    </UpdateFormContext.Provider>
  );
}

// Product Type Step Component - uses UpdateForm context
function ProductTypeStep() {
  const { productType, setProductType, customType, setCustomType } =
    useUpdateForm();

  const PREDEFINED_TYPES = [
    { id: "Shirt", label: "Shirt", icon: "👕", category: "Fashion" },
    { id: "Trouser", label: "Trouser", icon: "👖", category: "Fashion" },
    { id: "Shoes", label: "Shoes", icon: "👟", category: "Fashion" },
    { id: "Jewelry", label: "Jewelry", icon: "💍", category: "Fashion" },
    { id: "Furniture", label: "Furniture", icon: "🪑", category: "Home" },
    { id: "Custom", label: "Other / Custom", icon: "✨", category: "Custom" },
  ];

  const isCustom = productType === "Custom";

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium text-slate-800">Product Type</h2>
        <p className="text-xs text-slate-400">
          Select a predefined type or enter a custom one
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {PREDEFINED_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => {
              setProductType(type.id);
              if (type.id !== "Custom") setCustomType("");
            }}
            className={`
              relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 
              transition-all duration-200
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
        <div className="flex flex-col gap-3 p-6 bg-purple-50 rounded-xl border border-purple-200">
          <label className="text-sm font-medium text-purple-900">
            Enter Custom Product Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            placeholder="e.g., Washing Machine, Refrigerator..."
            className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          />
          <div className="flex flex-wrap gap-2 text-xs text-purple-700">
            <span className="font-medium">Examples:</span>
            {[
              "Washing Machine",
              "Refrigerator",
              "Microwave",
              "Air Conditioner",
            ].map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setCustomType(ex)}
                className="px-2 py-1 bg-purple-100 hover:bg-purple-200 rounded"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
