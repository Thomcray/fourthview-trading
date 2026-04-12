"use client";

import { useEffect, useState } from "react";
import Selection from "@/components/Selection";

type Category = {
  id: number;
  name: string;
  image_url: string;
};

type Props = {
  productType?: string;
  product?: {
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
  } | null;
};

export default function Category({ productType = "", product }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  const isFurniture =
    productType === "Furniture" || product?.productType === "Furniture";

  const defaultCategory = categories.find((c) => c.id === product?.categoryId);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium text-slate-800">Category</h2>
        <p className="text-xs text-slate-400">
          Assign this product to a category and audience
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Category <span className="text-red-400">*</span>
          </label>
          <Selection
            defaultValue={
              defaultCategory ? defaultCategory.name : "Select Category"
            }
            name="category"
            width="w-full"
          >
            {categories.map((category) => (
              <option value={category.name} key={category.name}>
                {category.name}
              </option>
            ))}
          </Selection>
          <span className="text-xs text-slate-400">
            Choose the most relevant category for this product
          </span>
        </div>

        {/* Target — clothing */}
        {!isFurniture && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Target Audience <span className="text-red-400">*</span>
            </label>
            <Selection
              defaultValue={product?.target || "Select Target"}
              name="target"
              width="w-full"
            >
              {["Men", "Women", "Kids"].map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </Selection>
            <span className="text-xs text-slate-400">
              Determines which shop section this product appears in
            </span>
          </div>
        )}

        {/* Target — furniture style */}
        {isFurniture && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Furniture Style <span className="text-red-400">*</span>
            </label>
            <Selection
              defaultValue={product?.target || "Select Style"}
              name="target"
              width="w-full"
            >
              {["Modern Style", "Antique", "Chinese Style"].map((style) => (
                <option value={style} key={style}>
                  {style}
                </option>
              ))}
            </Selection>
            <span className="text-xs text-slate-400">
              Determines which section this product appears in on the furniture
              page
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
