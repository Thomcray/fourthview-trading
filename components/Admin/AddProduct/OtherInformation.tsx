"use client";

import Selection from "@/components/Selection";
import React, { useState } from "react";

type OtherInformationProps = {
  productType?: string;
  productWeight?: string;
  shippingCost?: number;
  selectedSizes?: string[];
  isUpdatePage?: boolean;
  onTypeChange?: (type: string) => void;
  children: React.ReactNode;
};

const SIZE_OPTIONS = {
  Shirt: [
    "XS (EU 42)",
    "S (EU 44-46)",
    "M (EU 48-50)",
    "L (EU 52-54)",
    "XL (EU 56-58)",
    "XXL (EU 60-62)",
    "XXXL (EU 64-66)",
  ],
  Trouser: [
    "28 (EU 38)",
    "30 (EU 40)",
    "32 (EU 42)",
    "34 (EU 44)",
    "36 (EU 46)",
    "38 (EU 48)",
    "40 (EU 50)",
    "42 (EU 52)",
  ],
  Shoes: [
    "6 (EU 39)",
    "7 (EU 40)",
    "8 (EU 41)",
    "9 (EU 42)",
    "10 (EU 43)",
    "11 (EU 44)",
    "12 (EU 45)",
    "13 (EU 46)",
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
    "L-Shape",
    "Small (60x60cm)",
    "Medium (80x80cm)",
    "Large (100x100cm)",
    "Extra Large (120x120cm)",
  ],
};

const PRODUCT_TYPES = ["Shirt", "Trouser", "Shoes", "Jewelry", "Furniture"];

const WEIGHT_OPTIONS = [
  { value: "0-0.5", label: "0 - 0.5 kg (Light items)" },
  { value: "0.5-1", label: "0.5 - 1 kg" },
  { value: "1-2", label: "1 - 2 kg" },
  { value: "2-5", label: "2 - 5 kg" },
  { value: "5-10", label: "5 - 10 kg" },
  { value: "10-20", label: "10 - 20 kg (Heavy items)" },
  { value: "20+", label: "20+ kg (Extra heavy)" },
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

export default function OtherInformation({
  productType,
  productWeight,
  shippingCost,
  selectedSizes = [],
  isUpdatePage = false,
  onTypeChange,
  children,
}: OtherInformationProps) {
  const [selectedType, setSelectedType] = useState(productType || "");
  const [selectedWeight, setSelectedWeight] = useState(productWeight || "");
  const [cost, setCost] = useState(shippingCost?.toString() || "");

  const availableSizes =
    selectedType && SIZE_OPTIONS[selectedType as keyof typeof SIZE_OPTIONS]
      ? SIZE_OPTIONS[selectedType as keyof typeof SIZE_OPTIONS]
      : [];

  const isFurniture = selectedType === "Furniture";

  return (
    <div className="w-full flex flex-col gap-6 px-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium text-slate-800">
          Other Information
        </h2>
        <p className="text-xs text-slate-400">
          Specify product type, sizing, weight and shipping details
        </p>
      </div>

      <div className="w-full flex flex-col gap-5">
        {/* Product Type */}
        <div className="flex flex-col gap-1.5">
          <SectionLabel>Product Type</SectionLabel>
          <Selection
            defaultValue={productType || "Select Type"}
            name="type"
            width="w-96 max-sm:w-full"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectedType(e.target.value);
              onTypeChange?.(e.target.value);
            }}
            required={false}
          >
            {PRODUCT_TYPES.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </Selection>
          <HintText>
            Determines available size options for this product
          </HintText>
        </div>

        {/* Furniture style */}
        {isFurniture && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Furniture Style</SectionLabel>
            <Selection
              defaultValue="Select Style"
              name="target"
              width="w-96 max-sm:w-full"
              required={false}
            >
              {["Modern Style", "Antique", "Chinese Style"].map((style) => (
                <option value={style} key={style}>
                  {style}
                </option>
              ))}
            </Selection>
            <HintText>
              Determines which section this product appears in on the furniture
              page
            </HintText>
          </div>
        )}

        {/* Sizes */}
        {availableSizes.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>
              {isFurniture
                ? "Available Dimensions / Configurations"
                : "Available Sizes"}
            </SectionLabel>

            {isUpdatePage && selectedSizes?.length > 0 && (
              <CurrentValueBadge
                label="Current sizes"
                value={selectedSizes.join(", ")}
              />
            )}

            <div className="w-96 max-sm:w-full p-4 border rounded-lg bg-white">
              <div
                className={`grid gap-1 ${isFurniture ? "grid-cols-2" : "grid-cols-3"}`}
              >
                {availableSizes.map((size) => (
                  <label
                    key={size}
                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-md transition-colors"
                  >
                    <input
                      type="checkbox"
                      name="sizes"
                      value={size}
                      defaultChecked={
                        isUpdatePage && selectedSizes?.includes(size)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600">{size}</span>
                  </label>
                ))}
              </div>
            </div>
            <HintText>
              {isFurniture
                ? "Select all dimensions or configurations available for this product"
                : "Select all sizes available for this product"}
            </HintText>
          </div>
        )}

        {/* Weight */}
        <div className="flex flex-col gap-1.5">
          <SectionLabel>Weight Range</SectionLabel>
          {isUpdatePage &&
            selectedWeight &&
            selectedWeight !== "Select Weight" && (
              <CurrentValueBadge
                label="Current weight"
                value={`${selectedWeight} kg`}
              />
            )}
          <Selection
            defaultValue={productWeight || "Select Weight"}
            name="weight"
            width="w-96 max-sm:w-full"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedWeight(e.target.value)
            }
            required={false}
          >
            {WEIGHT_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </Selection>
          <HintText>Used to calculate shipping cost at checkout</HintText>
        </div>

        {/* Shipping cost */}
        {selectedWeight && selectedWeight !== "Select Weight" && (
          <div className="flex flex-col gap-1.5">
            <SectionLabel>Shipping Cost ({selectedWeight} kg)</SectionLabel>
            {isUpdatePage && cost && (
              <CurrentValueBadge
                label="Current shipping cost"
                value={`¥${cost}`}
              />
            )}
            <div className="flex items-center rounded-lg border bg-white shadow-sm h-11 w-96 max-sm:w-full overflow-hidden">
              <span className="px-3 text-slate-500 font-medium border-r h-full flex items-center bg-slate-50">
                ¥
              </span>
              <input
                type="number"
                name="shippingCost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="flex-1 px-3 py-2 border-0 focus:outline-none text-sm text-slate-800"
              />
            </div>
            <HintText>This cost will be added to the cart at checkout</HintText>
          </div>
        )}

        {/* Colours */}
        <div className="flex flex-col gap-1.5">
          <SectionLabel>Available Colours</SectionLabel>
          {children}
          <HintText>
            Each colour should correspond to a product image of that colour
          </HintText>
        </div>
      </div>
    </div>
  );
}
