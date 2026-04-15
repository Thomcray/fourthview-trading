"use client";

import { useEffect, useState } from "react";
import Selection from "@/components/Selection";
import { useUpdateForm } from "./UpdateForm";

type CategoryItem = {
  id: number;
  name: string;
  image_url: string;
};

const FASHION_TYPES = ["Shirt", "Trouser", "Shoes", "Jewelry"];
const FURNITURE_TYPES = ["Furniture"];

export default function UpdateCategory() {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedTarget,
    setSelectedTarget,
    finalProductType,
    customType,
    product,
  } = useUpdateForm();

  const productType = finalProductType;
  const isCustom = customType.trim().length > 0;

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (product && categories.length > 0) {
      const defaultCat = categories.find((c) => c.id === product.categoryId);
      if (defaultCat && !selectedCategory) {
        setSelectedCategory(defaultCat.name);
      }
      if (product.target && !selectedTarget) {
        setSelectedTarget(product.target);
      }
    }
  }, [
    product,
    categories,
    selectedCategory,
    selectedTarget,
    setSelectedCategory,
    setSelectedTarget,
  ]);

  const isPredefinedFashion = FASHION_TYPES.includes(productType);
  const isPredefinedFurniture = FURNITURE_TYPES.includes(productType);
  const selectedCategoryObj = categories.find(
    (c) => c.name === selectedCategory,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium text-slate-800">
          Category & Audience
        </h2>
        <p className="text-xs text-slate-400">
          Assign this product to a category
        </p>
      </div>

      <div className="p-3 bg-gray-50 rounded-lg border flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-500">Product Type:</span>
          <span className="ml-2 font-medium text-gray-800">{productType}</span>
        </div>
        {isCustom && (
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
            Custom
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">
          Category <span className="text-red-400">*</span>
        </label>
        <Selection
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          name="category"
          width="w-full"
          required
          placeholder="Select a category"
        >
          {categories.map((category) => (
            <option value={category.name} key={category.id}>
              {category.name}
            </option>
          ))}
        </Selection>

        {selectedCategory && selectedCategoryObj ? (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">
                Selected Category
              </p>
              <p className="text-xs text-green-600">
                {selectedCategoryObj.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              <span className="font-medium">⚠️ No category selected</span>
            </p>
            <p className="text-xs text-yellow-600">
              Please select a category from the dropdown
            </p>
          </div>
        )}

        <span className="text-xs text-slate-400">
          Choose the most relevant category for this {productType}
        </span>
      </div>

      {isPredefinedFashion && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Target Audience <span className="text-red-400">*</span>
          </label>
          <Selection
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            name="target"
            width="w-full"
            required
            placeholder="Select Target"
          >
            {["Men", "Women", "Kids", "Unisex"].map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </Selection>
          {selectedTarget && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Target:</span> {selectedTarget}
              </p>
            </div>
          )}
        </div>
      )}

      {isPredefinedFurniture && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Furniture Style <span className="text-red-400">*</span>
          </label>
          <Selection
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            name="target"
            width="w-full"
            required
            placeholder="Select Style"
          >
            {["Modern", "Antique", "Chinese", "Minimalist"].map((s) => (
              <option value={s} key={s}>
                {s}
              </option>
            ))}
          </Selection>
          {selectedTarget && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Style:</span> {selectedTarget}
              </p>
            </div>
          )}
        </div>
      )}

      {isCustom && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Product Tags / Specifications
          </label>
          <input
            type="text"
            name="customTags"
            placeholder="e.g., Front-Load, 8kg Capacity, Energy Efficient..."
            className="w-full px-3 py-2 border rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          />
          <span className="text-xs text-slate-400">
            Add descriptive tags to help customers find this {productType}
          </span>
        </div>
      )}

      {isCustom && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm font-medium text-purple-800 mb-1">
            Custom Product Configuration
          </p>
          <p className="text-xs text-purple-600">
            Since this is a custom product type, ensure you select an
            appropriate category. You&apos;ll add specifications in the next
            step.
          </p>
        </div>
      )}
    </div>
  );
}
