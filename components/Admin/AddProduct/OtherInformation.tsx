"use client";

import Selection from "@/components/Selection";
import React, { useState, useEffect } from "react";
import { useCurrency } from "@/components/CurrencyContext";
import { SIZE_OPTIONS } from "@/app/_lib/data/product-sizes";

type OtherInformationProps = {
  productType: string;
  isCustom?: boolean;
  productWeight?: string;
  shippingCost?: number;
  selectedSizes?: string[];
  isUpdatePage?: boolean;
  children: React.ReactNode;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-slate-700">{children}</p>;
}

function HintText({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-slate-400">{children}</span>;
}

function CurrentValueBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-700">
      <span className="font-medium">{label}:</span> {value}
    </div>
  );
}

export default function OtherInformation({
  productType,
  isCustom,
  productWeight,
  shippingCost,
  selectedSizes = [],
  isUpdatePage = false,
  children,
}: OtherInformationProps) {
  const { formatPrice } = useCurrency();

  const [selectedWeight, setSelectedWeight] = useState(productWeight || "");
  const [calculatedCost, setCalculatedCost] = useState<number | null>(
    shippingCost || null,
  );
  const [ratePerKg, setRatePerKg] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Custom specs state (for custom product types)
  const [customSpecs, setCustomSpecs] = useState<string[]>([]);
  const [newSpec, setNewSpec] = useState("");

  const predefinedSizes = SIZE_OPTIONS[productType] || [];
  const hasPredefinedSizes = predefinedSizes.length > 0;

  // Auto-calculate shipping when weight changes
  useEffect(() => {
    if (!selectedWeight) {
      setCalculatedCost(null);
      return;
    }

    const calculateShipping = async () => {
      setIsCalculating(true);
      try {
        const res = await fetch("/api/calculate-shipping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weight: selectedWeight }),
        });

        if (!res.ok) throw new Error("Calculation failed");

        const data = await res.json();
        setCalculatedCost(data.shippingCost);
        setRatePerKg(data.rate_per_kg);
      } catch (err) {
        console.error("Failed to calculate shipping:", err);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateShipping();
  }, [selectedWeight]);

  const addCustomSpec = () => {
    if (newSpec.trim() && !customSpecs.includes(newSpec.trim())) {
      setCustomSpecs([...customSpecs, newSpec.trim()]);
      setNewSpec("");
    }
  };

  const removeSpec = (idx: number) => {
    setCustomSpecs(customSpecs.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium text-slate-800">
          Product Details
        </h2>
        <p className="text-xs text-slate-400">
          Configure sizing, weight and shipping for {productType}
        </p>
      </div>

      {/* Sizes Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sizes */}
        {hasPredefinedSizes ? (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Available Sizes</SectionLabel>
            {isUpdatePage && selectedSizes.length > 0 && (
              <CurrentValueBadge
                label="Current sizes"
                value={selectedSizes.join(", ")}
              />
            )}
            <div className="p-4 border rounded-lg bg-white max-h-72 overflow-y-auto">
              <div className="grid gap-1 grid-cols-2">
                {predefinedSizes.map((size) => (
                  <label
                    key={size}
                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-md"
                  >
                    <input
                      type="checkbox"
                      name="sizes"
                      value={size}
                      defaultChecked={
                        isUpdatePage && selectedSizes.includes(size)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 shrink-0"
                    />
                    <span className="text-xs text-slate-600">{size}</span>
                  </label>
                ))}
              </div>
            </div>
            <HintText>Select all sizes available for this product</HintText>
          </div>
        ) : isCustom ? (
          <div className="flex flex-col gap-3">
            <SectionLabel>Custom Specifications</SectionLabel>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                placeholder="e.g., 8kg capacity, 1400 RPM..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomSpec();
                  }
                }}
              />
              <button
                type="button"
                onClick={addCustomSpec}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {customSpecs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customSpecs.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => removeSpec(idx)}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {customSpecs.map((spec, idx) => (
              <input key={idx} type="hidden" name="sizes" value={spec} />
            ))}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-600">
              No specific size options for {productType}
            </p>
          </div>
        )}

        {/* Weight */}
        <div className="flex flex-col gap-1.5">
          <SectionLabel>Product Weight (KG)</SectionLabel>
          {isUpdatePage && selectedWeight && (
            <CurrentValueBadge
              label="Current weight"
              value={`${selectedWeight} kg`}
            />
          )}
          <input
            type="number"
            name="weight"
            value={selectedWeight}
            onChange={(e) => setSelectedWeight(e.target.value)}
            placeholder="e.g. 1.5"
            min="0.01"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none h-11"
          />
          <HintText>
            {ratePerKg
              ? `Rate: ¥${ratePerKg}/kg from admin settings`
              : "Select weight to calculate shipping"}
          </HintText>

          {/* Shipping Cost */}
          {selectedWeight && calculatedCost !== null && (
            <div className="flex flex-col gap-1.5 mt-2">
              <SectionLabel>Calculated Shipping Cost</SectionLabel>
              {isUpdatePage && shippingCost && (
                <CurrentValueBadge
                  label="Previous shipping"
                  value={`¥${shippingCost}`}
                />
              )}
              <input type="hidden" name="shippingCost" value={calculatedCost} />
              <div className="flex items-center rounded-lg border bg-green-50 border-green-200 shadow-sm h-11 w-full overflow-hidden">
                <span className="px-3 text-green-600 font-medium border-r border-green-200 h-full flex items-center bg-green-100">
                  {formatPrice(calculatedCost)!.charAt(0)}
                </span>
                <span className="flex-1 px-3 py-2 text-sm text-slate-800 font-medium">
                  {isCalculating
                    ? "..."
                    : formatPrice(calculatedCost)!.slice(1)}
                </span>
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <p>Stored: ¥{calculatedCost} (CNY)</p>
                <p className="text-green-600">
                  Calculation: {selectedWeight} kg × ¥{ratePerKg}/kg = ¥
                  {calculatedCost}
                </p>
              </div>
            </div>
          )}

          {!selectedWeight && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700 mt-2">
              Select a weight to calculate shipping cost
            </div>
          )}
        </div>
      </div>

      {/* Colours */}
      <div className="flex flex-col gap-1.5">
        <SectionLabel>Available Colours</SectionLabel>
        {children}
        <HintText>Each colour should correspond to a product image</HintText>
      </div>
    </div>
  );
}
