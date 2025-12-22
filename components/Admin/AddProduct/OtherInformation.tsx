import Selection from "@/components/Selection";
import React, { useState } from "react";

type OtherInformationProps = {
  productType?: string;
  productWeight?: string;
  shippingCost?: number;
  selectedSizes?: string[];
  isUpdatePage?: boolean;
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
};

const WEIGHT_OPTIONS = [
  { value: "0-0.5", label: "0 - 0.5 kg (Light items)" },
  { value: "0.5-1", label: "0.5 - 1 kg" },
  { value: "1-2", label: "1 - 2 kg" },
  { value: "2-5", label: "2 - 5 kg" },
  { value: "5-10", label: "5 - 10 kg" },
  { value: "10-20", label: "10 - 20 kg (Heavy items)" },
  { value: "20+", label: "20+ kg (Extra heavy)" },
];

export default function OtherInformation({
  productType,
  productWeight,
  shippingCost,
  selectedSizes = [],
  isUpdatePage = false,
  children,
}: OtherInformationProps) {
  const [selectedType, setSelectedType] = useState(productType || "");
  const [selectedWeight, setSelectedWeight] = useState(productWeight || "");
  const [cost, setCost] = useState(shippingCost?.toString() || "");

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeight(e.target.value);
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCost(e.target.value);
  };

  const availableSizes =
    selectedType && SIZE_OPTIONS[selectedType as keyof typeof SIZE_OPTIONS]
      ? SIZE_OPTIONS[selectedType as keyof typeof SIZE_OPTIONS]
      : [];

  return (
    <div className="w-full flex flex-col gap-4 px-4">
      <h2 className="text-base text-black">Other Information</h2>

      <div className="w-full flex flex-col gap-4 border-0">
        <label className="text-sm text-slate-500 flex flex-col gap-1 text-left font-light">
          Product Type
          <Selection
            defaultValue={productType ? productType : "Select Type"}
            name="type"
            width="w-96 max-sm:w-full"
            onChange={handleTypeChange}
            required={false}
          >
            {["Shirt", "Trouser", "Shoes", "Jewelry"].map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </Selection>
        </label>

        {availableSizes.length > 0 && (
          <label className="text-sm text-slate-500 flex flex-col gap-1 text-left font-light">
            Available Sizes (select multiple)
            {isUpdatePage && selectedSizes.length > 0 && (
              <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <span className="font-semibold">Current sizes:</span>{" "}
                {selectedSizes.join(", ")}
              </div>
            )}
            <div className="w-96 max-sm:w-full mt-1 p-4 border rounded-md shadow-sm bg-white">
              <div className="grid grid-cols-3 gap-2">
                {availableSizes.map((size) => (
                  <label
                    key={size}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      name="sizes"
                      value={size}
                      defaultChecked={
                        isUpdatePage && selectedSizes.includes(size)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">{size}</span>
                  </label>
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-400 mt-1">
              Select all sizes that are available for this product
            </span>
          </label>
        )}

        <label className="text-sm text-slate-500 flex flex-col gap-1 text-left font-light">
          Weight Range
          {isUpdatePage &&
            selectedWeight &&
            selectedWeight !== "Select Weight" && (
              <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <span className="font-semibold">Current weight:</span>{" "}
                {selectedWeight} kg
              </div>
            )}
          <Selection
            defaultValue={productWeight ? productWeight : "Select Weight"}
            name="weight"
            width="w-96 max-sm:w-full"
            onChange={handleWeightChange}
            required={false}
          >
            {WEIGHT_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </Selection>
        </label>

        {selectedWeight && selectedWeight !== "Select Weight" && (
          <label className="text-sm text-slate-500 flex flex-col gap-1 text-left font-light">
            Shipping Cost for {selectedWeight} kg
            {isUpdatePage && cost && (
              <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <span className="font-semibold">Current shipping cost:</span> $
                {cost}
              </div>
            )}
            <div className="flex items-center rounded-sm border shadow h-12.25 mt-1 w-96 max-sm:w-full">
              <span className="px-3 text-gray-600 font-medium">&yen;</span>
              <input
                type="number"
                name="shippingCost"
                value={cost}
                onChange={handleCostChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="flex-1 px-2 py-3 border-0 focus:outline-none text-sm"
              />
            </div>
            <span className="text-xs text-gray-400 mt-1">
              This cost will be added to cart based on item weight
            </span>
          </label>
        )}

        <div className="w-full">
          <label className="text-sm text-slate-500 flex flex-col gap-1 text-left font-light">
            Available Colours
            {children}
          </label>
        </div>
      </div>
    </div>
  );
}
