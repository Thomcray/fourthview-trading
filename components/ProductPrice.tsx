"use client";

import { useCurrency } from "./CurrencyContext";

export default function ProductPrice({
  yuanPrice,
  discount,
  showOriginal = false,
}: {
  yuanPrice: number;
  discount?: number;
  showOriginal?: boolean;
}) {
  const { formatPrice, currency, isLoading, error } = useCurrency();

  if (isLoading) {
    return (
      <span className="animate-pulse bg-gray-200 rounded w-20 h-5 inline-block" />
    );
  }

  const discountedYuanPrice = discount
    ? yuanPrice - (yuanPrice * discount) / 100
    : yuanPrice;

  if (error) {
    return (
      <span className="flex flex-col">
        <span className="text-md font-bold">
          ¥{discountedYuanPrice.toFixed(2)} CNY
        </span>
        {discount && (
          <span className="text-xs text-gray-400 line-through">
            ¥{yuanPrice.toFixed(2)} CNY
          </span>
        )}
        <span className="text-xs text-red-500">Rates unavailable</span>
      </span>
    );
  }

  if (discount) {
    return (
      <span className="flex flex-col">
        <span className="flex items-center gap-2">
          <span className="text-md font-bold text-red-600">
            {formatPrice(discountedYuanPrice)}
          </span>
          {/* <span className="text-xs text-gray-400 line-through">
            {formatPrice(yuanPrice)}
          </span> */}
        </span>
        {showOriginal && currency.code !== "CNY" && (
          <span className="text-xs text-gray-400">
            ≈ ¥{discountedYuanPrice.toFixed(2)} CNY
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="flex flex-col">
      <span className="text-md font-bold">{formatPrice(yuanPrice)}</span>
      {showOriginal && currency.code !== "CNY" && (
        <span className="text-xs text-gray-400">
          ≈ ¥{yuanPrice.toFixed(2)} CNY
        </span>
      )}
    </span>
  );
}
