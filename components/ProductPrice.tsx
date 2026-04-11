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

  useEffect(() => {
    setMounted(true);

    async function getRate() {
      const res = await fetch("/api/exchange-rate");
      const data = await res.json();
      setRate(data.NGN);
    }
    getRate();
  }, []);

  if (!mounted || !rate) {
    return <span>...</span>;
  }

  const nairaPrice = convertToNaira(yuanPrice, rate);
  const finalPrice = discount
    ? handleDiscount(nairaPrice, discount)
    : nairaPrice;

  const formattedPrice = Number(finalPrice.toFixed(2)).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return <span className="text-md font-bold">&#8358; {formattedPrice}</span>;
}
