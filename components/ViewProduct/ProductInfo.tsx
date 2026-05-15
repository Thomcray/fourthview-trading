"use client";

import { useCallback } from "react";
import { Weight, Truck } from "lucide-react";
import ProductPrice from "@/components/ProductPrice";
import { TopPickProduct } from "@/hooks/useTopPicks";

interface Props {
  product: TopPickProduct;
  selectedSize: string | null;
  selectedColour: string | null;
  onSizeChange: (size: string) => void;
  onColourChange: (idx: number) => void;
  isSwitching: boolean;
  sizeUpdated: boolean;
  colourUpdated: boolean;
  onImageIdxChange: (idx: number) => void;
  imageIdx: number;
}

export default function ProductInfo({
  product,
  selectedSize,
  selectedColour,
  onSizeChange,
  onColourChange,
  isSwitching,
  sizeUpdated,
  colourUpdated,
  onImageIdxChange,
  imageIdx,
}: Props) {
  const hasSizes = (product.sizes?.length ?? 0) > 0;
  const hasColours = (product.colours?.length ?? 0) > 0;

  const handleColourClick = useCallback(
    (idx: number) => {
      // Only trigger image load if it's a different image
      if (idx !== imageIdx) {
        onImageIdxChange(idx);
      }
      // Always trigger color selection (for cart logic)
      onColourChange(idx);
    },
    [onColourChange, onImageIdxChange, imageIdx],
  );

  return (
    <div className="flex flex-col gap-5 flex-1">
      {/* Name + price */}
      <div className="flex flex-col gap-1 pb-4 border-b">
        <h2 className="text-2xl font-semibold text-slate-800">
          {product.name}
        </h2>
        <div className="flex flex-row items-center gap-3 mt-1">
          {product.discount ? (
            <>
              <span className="text-xl font-bold text-red-500">
                <ProductPrice
                  yuanPrice={product.price}
                  discount={product.discount}
                />
              </span>
              <span className="text-base text-slate-400 line-through">
                <ProductPrice yuanPrice={product.price} />
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-blue-950">
              <ProductPrice yuanPrice={product.price} />
            </span>
          )}
        </div>
      </div>

      {/* Weight + shipping */}
      {product.weight && (
        <div className="flex flex-row gap-4 flex-wrap">
          <div className="flex flex-row items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <Weight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-600">{product.weight} kg</span>
          </div>
          <div className="flex flex-row items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
            <Truck className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-600">
              Shipping: <ProductPrice yuanPrice={product.shippingCost} />
            </span>
          </div>
        </div>
      )}

      {/* Sizes */}
      {hasSizes && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <p className="text-sm font-medium text-slate-700">Select Size</p>
            {sizeUpdated && (
              <span className="text-xs text-green-600 font-medium animate-pulse">
                ✓ Size updated
              </span>
            )}
            {isSwitching && (
              <span className="text-xs text-blue-600 font-medium animate-pulse">
                Switching...
              </span>
            )}
          </div>
          <div className="flex flex-row gap-2 flex-wrap">
            {product.sizes.map((size, idx) => (
              <button
                key={idx}
                onClick={() => onSizeChange(size)}
                disabled={isSwitching}
                className={`relative text-sm px-3 py-1.5 border cursor-pointer transition-all rounded disabled:opacity-50
                  ${
                    selectedSize === size
                      ? "border-blue-500 bg-blue-50 text-blue-900 font-medium"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                  }`}
              >
                {size}
                {selectedSize === size && (
                  <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colours */}
      {hasColours && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <p className="text-sm font-medium text-slate-700">Select Colour</p>
            {colourUpdated && (
              <span className="text-xs text-green-600 font-medium animate-pulse">
                ✓ Colour updated
              </span>
            )}
            {isSwitching && (
              <span className="text-xs text-blue-600 font-medium animate-pulse">
                Switching...
              </span>
            )}
          </div>
          <div className="flex flex-row gap-2 flex-wrap">
            {product.colours.map((colour, idx) => (
              <button
                key={idx}
                style={{ backgroundColor: colour }}
                onClick={() => handleColourClick(idx)}
                disabled={isSwitching}
                className={`relative w-8 h-8 rounded-full border-2 cursor-pointer transition-all disabled:opacity-50
                  ${
                    selectedColour === colour
                      ? "border-blue-500 scale-110 shadow-md"
                      : "border-slate-200 hover:border-blue-300"
                  }`}
              >
                {selectedColour === colour && (
                  <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[10px] rounded-full w-3.5 h-3.5 flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="flex flex-col gap-2 pt-4 border-t">
        <h3 className="font-semibold text-base text-slate-800">
          Product Description
        </h3>
        <p className="text-sm font-light text-slate-600 leading-7">
          {product.description}
        </p>
        <p className="text-sm text-slate-500 leading-7">
          For special orders, please note that a special shipping fee will apply
          to ensure expedited processing and delivery.
        </p>
        <p className="text-sm text-slate-500 leading-7">
          If you have any questions or require further assistance, feel free to
          contact our customer support team.
        </p>
      </div>
    </div>
  );
}
