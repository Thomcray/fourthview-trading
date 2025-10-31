"use client";

import { convertToNaira } from "@/utils/toNaira";
import { useEffect, useState } from "react";

export default function ProductPrice({ yuanPrice }: { yuanPrice: number }) {
  const [rate, setRate] = useState<number | null>(null);
  useEffect(() => {
    async function getRate() {
      const res = await fetch("/api/exchange-rate");

      const data = await res.json();
      setRate(data.NGN);
    }
    getRate();
  }, []);

  if (!rate) return <span>loading...</span>;

  const nairaPrice = convertToNaira(yuanPrice, rate);

  return (
    <span className="text-sm">
      &#8358;{nairaPrice.toFixed(2).toLocaleString()}
    </span>
  );
}
