"use client";

import { Input } from "@/components/ui/input";
import { useFormData } from "./ProductForm";

export default function Pricing() {
  const { formData, updateFormData } = useFormData();

  return (
    <div className="w-full flex flex-col gap-6 max-sm:px-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium text-slate-800">Pricing</h2>
        <p className="text-xs text-slate-400">
          Set the base price and optional discount for this product
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Base price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Base Price <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center rounded-lg border bg-white shadow-sm h-11 overflow-hidden">
            <span className="px-3 text-slate-500 font-medium border-r h-full flex items-center bg-slate-50">
              ¥
            </span>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => updateFormData("price", e.target.value)}
              placeholder="0.00"
              className="flex-1 border-0 shadow-none focus-visible:ring-0 px-3 text-slate-800"
              required
            />
          </div>
          <span className="text-xs text-slate-400">
            Enter the price in Chinese Yuan (¥)
          </span>
        </div>

        {/* Discount */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Discount{" "}
            <span className="text-xs text-slate-400 font-normal">
              (optional)
            </span>
          </label>
          <div className="flex flex-row gap-3">
            <div className="flex items-center rounded-lg border bg-white shadow-sm h-11 overflow-hidden w-32">
              <Input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={(e) => updateFormData("discount", e.target.value)}
                placeholder="0"
                min={0}
                max={100}
                className="flex-1 border-0 shadow-none focus-visible:ring-0 px-3 text-slate-800"
              />
              <span className="px-3 text-slate-500 font-medium border-l h-full flex items-center bg-slate-50">
                %
              </span>
            </div>

            <div className="flex items-center rounded-lg border bg-white shadow-sm h-11 overflow-hidden flex-1">
              <span className="px-3 text-slate-500 text-xs border-r h-full flex items-center bg-slate-50 whitespace-nowrap">
                Type
              </span>
              <Input
                type="text"
                name="discountType"
                value={formData.discountType}
                onChange={(e) => updateFormData("discountType", e.target.value)}
                placeholder="e.g. Clearance, Sale, Promo"
                className="flex-1 border-0 shadow-none focus-visible:ring-0 px-3 text-slate-800"
              />
            </div>
          </div>
          <span className="text-xs text-slate-400">
            Leave blank if no discount applies
          </span>
        </div>
      </div>
    </div>
  );
}
