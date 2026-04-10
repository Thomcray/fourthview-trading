"use client";

import handleDiscount from "@/utils/handleDiscount";
import { convertToNaira } from "@/utils/toNaira";
import { useEffect, useState } from "react";

export default function ProductPrice({
  yuanPrice,
  discount,
}: {
  yuanPrice: number;
  discount?: number;
}) {
  const [rate, setRate] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  if (!discount) return;

  useEffect(() => {
    setMounted(true);

    async function getRate() {
      const res = await fetch("/api/exchange-rate");
      const data = await res.json();
      setRate(data.NGN);
    }
    getRate();
  }, []);

  // Don't render until mounted on client
  if (!mounted || !rate) {
    return <span>...</span>;
  }

  const nairaPrice = convertToNaira(yuanPrice, rate);
  const customerDiscount = handleDiscount(yuanPrice, discount);

  // Convert to fixed string first, then format
  const formattedPrice = Number(nairaPrice.toFixed(2)).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return <span className="text-md font-bold">&#8358; {formattedPrice}</span>;
}
