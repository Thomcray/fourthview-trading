import { useState, useEffect } from "react";

export function useExchangeRate() {
  const [rate, setRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getRate() {
      try {
        const res = await fetch("/api/exchange-rate");
        const data = await res.json();
        setRate(data.NGN);
      } catch (err) {
        setError("Failed to fetch exchange rate");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    getRate();
  }, []);

  return { rate, isLoading, error };
}
