import { useState, useEffect } from "react";

type ExchangeRates = {
  NGN: number;
  GHS: number;
  USD: number;
  EUR: number;
  GBP: number;
  CAD: number;
  AUD: number;
  CNY: number;
};

export function useExchangeRate() {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getRates() {
      try {
        const res = await fetch("/api/exchange-rate");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // Validate that all required rates exist
        const requiredRates = ["NGN", "GHS", "USD", "EUR", "GBP", "CAD", "AUD"];
        const missingRates = requiredRates.filter((rate) => !data[rate]);

        if (missingRates.length > 0) {
          throw new Error(
            `Missing exchange rates for: ${missingRates.join(", ")}`,
          );
        }

        setRates({
          NGN: data.NGN,
          GHS: data.GHS,
          USD: data.USD,
          EUR: data.EUR,
          GBP: data.GBP,
          CAD: data.CAD,
          AUD: data.AUD,
          CNY: 1,
        });
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch exchange rate";
        setError(errorMessage);
        console.error("Exchange rate fetch error:", err);
        setRates(null);
      } finally {
        setIsLoading(false);
      }
    }
    getRates();
  }, []);

  const convertPrice = (priceInCNY: number, targetCurrency: string): number => {
    if (!rates) {
      console.warn("Exchange rates not available, returning original price");
      return priceInCNY;
    }
    const rate = rates[targetCurrency as keyof ExchangeRates];
    if (!rate) {
      console.warn(
        `No exchange rate found for ${targetCurrency}, returning original price`,
      );
      return priceInCNY;
    }
    return priceInCNY * rate;
  };

  return { rates, isLoading, error, convertPrice };
}
