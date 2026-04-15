"use client";

import Selection from "@/components/Selection";
import React, { useState, useEffect } from "react";
import { useCurrency } from "@/components/CurrencyContext";
import { useUpdateForm } from "./UpdateForm"; // ← added

// SIZE_OPTIONS, WEIGHT_OPTIONS, SectionLabel, HintText, CurrentValueBadge stay identical...

const SIZE_OPTIONS: Record<string, string[]> = {
  Shirt: [
    "XS (EU 42)",
    "S (EU 44-46)",
    "M (EU 48-50)",
    "L (EU 52-54)",
    "XL (EU 56-58)",
    "XXL (EU 60-62)",
  ],
  Trouser: [
    "28 (EU 38)",
    "30 (EU 40)",
    "32 (EU 42)",
    "34 (EU 44)",
    "36 (EU 46)",
    "38 (EU 48)",
  ],
  Shoes: [
    "6 (EU 39)",
    "7 (EU 40)",
    "8 (EU 41)",
    "9 (EU 42)",
    "10 (EU 43)",
    "11 (EU 44)",
  ],
  Jewelry: ["One Size", "Adjustable", "Small", "Medium", "Large"],
  Furniture: [
    "Single (90x190cm)",
    "Double (135x190cm)",
    "Queen (150x200cm)",
    "King (180x200cm)",
    "1 Seater",
    "2 Seater",
    "3 Seater",
  ],
};

const WEIGHT_OPTIONS = [
  { value: "0.1", label: "0.1 kg (Very light)" },
  { value: "0.25", label: "0.25 kg (Light)" },
  { value: "0.5", label: "0.5 kg" },
  { value: "1", label: "1 kg" },
  { value: "2", label: "2 kg" },
  { value: "5", label: "5 kg" },
  { value: "10", label: "10 kg" },
  { value: "20", label: "20 kg (Heavy)" },
  { value: "50", label: "50 kg (Extra heavy)" },
];

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

type OtherInformationProps = {
  children: React.ReactNode; // only children remains
};

export default function UpdateOtherInformation({
  children,
}: OtherInformationProps) {
  const { formatPrice } = useCurrency();

  // Pull everything needed from context
  const { finalProductType, customType, formData, product } = useUpdateForm();
  const productType = finalProductType;
  const isCustom = customType.trim().length > 0;
  const productWeight = formData.weight;
  const shippingCost = product?.shippingCost;
  const selectedSizes = formData.sizes;

  const [selectedWeight, setSelectedWeight] = useState(productWeight || "");
  const [calculatedCost, setCalculatedCost] = useState<number | null>(
    shippingCost || null,
  );
  const [ratePerKg, setRatePerKg] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [customSpecs, setCustomSpecs] = useState<string[]>([]);
  const [newSpec, setNewSpec] = useState("");

  const predefinedSizes = SIZE_OPTIONS[productType] || [];
  const hasPredefinedSizes = predefinedSizes.length > 0;

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
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium text-slate-800">
          Product Details
        </h2>
        <p className="text-xs text-slate-400">
          Configure sizing, weight and shipping for {productType}
        </p>
      </div>

      {hasPredefinedSizes ? (
        <div className="flex flex-col gap-1.5">
          <SectionLabel>Available Sizes</SectionLabel>
          {selectedSizes.length > 0 && (
            <CurrentValueBadge
              label="Current sizes"
              value={selectedSizes.join(", ")}
            />
          )}
          <div className="w-96 max-sm:w-full p-4 border rounded-lg bg-white">
            <div className="grid gap-1 grid-cols-3">
              {predefinedSizes.map((size) => (
                <label
                  key={size}
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-md"
                >
                  <input
                    type="checkbox"
                    name="sizes"
                    value={size}
                    defaultChecked={selectedSizes.includes(size)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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

      <div className="flex flex-col gap-1.5">
        <SectionLabel>Product Weight (KG)</SectionLabel>
        {selectedWeight && (
          <CurrentValueBadge
            label="Current weight"
            value={`${selectedWeight} kg`}
          />
        )}
        <Selection
          value={selectedWeight}
          onChange={(e) => setSelectedWeight(e.target.value)}
          name="weight"
          width="w-96 max-sm:w-full"
          placeholder="Select Weight Range"
        >
          {WEIGHT_OPTIONS.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.label}
            </option>
          ))}
        </Selection>
        <HintText>
          {ratePerKg
            ? `Rate: ¥${ratePerKg}/kg from admin settings`
            : "Select weight to calculate shipping"}
        </HintText>
      </div>

      {selectedWeight && calculatedCost !== null && (
        <div className="flex flex-col gap-1.5">
          <SectionLabel>Calculated Shipping Cost</SectionLabel>
          {shippingCost && (
            <CurrentValueBadge
              label="Previous shipping"
              value={`¥${shippingCost}`}
            />
          )}
          <input type="hidden" name="shippingCost" value={calculatedCost} />
          <div className="flex items-center rounded-lg border bg-green-50 border-green-200 shadow-sm h-11 w-96 max-sm:w-full overflow-hidden">
            <span className="px-3 text-green-600 font-medium border-r border-green-200 h-full flex items-center bg-green-100">
              {formatPrice(calculatedCost).charAt(0)}
            </span>
            <span className="flex-1 px-3 py-2 text-sm text-slate-800 font-medium">
              {isCalculating ? "..." : formatPrice(calculatedCost).slice(1)}
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
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
          Select a weight to calculate shipping cost
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <SectionLabel>Available Colours</SectionLabel>
        {children}
        <HintText>Each colour should correspond to a product image</HintText>
      </div>
    </div>
  );
}
