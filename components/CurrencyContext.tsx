"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useExchangeRate } from "@/hooks/useExchangeRate";

type Currency = {
  code: string;
  symbol: string;
  name: string;
};

type ExchangeRates = {
  NGN: number;
  USD: number;
  EUR: number;
  GBP: number;
  CAD: number;
  AUD: number;
  CNY: number;
};

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (code: string) => void;
  convertPrice: (priceInCNY: number) => number;
  formatPrice: (priceInCNY: number) => string;
  availableCurrencies: Currency[];
  isLoading: boolean;
  error: string | null;
  rates: ExchangeRates | null;
};

const CURRENCY_META: Record<string, Currency> = {
  NGN: { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  USD: { code: "USD", symbol: "$", name: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", name: "Euro" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound" },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar" },
};

const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  NG: "NGN",
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const {
    rates,
    isLoading: ratesLoading,
    error: ratesError,
  } = useExchangeRate();
  const [currencyCode, setCurrencyCode] = useState<string>("NGN");
  const [locationError, setLocationError] = useState<string | null>(null);

  // Detect preferred currency from localStorage or IP — runs once rates are ready
  useEffect(() => {
    if (ratesLoading) return;

    const saved = localStorage.getItem("preferredCurrency");
    if (saved && CURRENCY_META[saved]) {
      setCurrencyCode(saved);
      return;
    }

    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const detected = COUNTRY_CURRENCY_MAP[data.country_code] || "NGN";
        setCurrencyCode(detected);
      })
      .catch(() => {
        setLocationError("Could not detect location");
        setCurrencyCode("NGN");
      });
  }, [ratesLoading]);

  const setCurrency = useCallback((code: string) => {
    if (!CURRENCY_META[code]) return;
    setCurrencyCode(code);
    localStorage.setItem("preferredCurrency", code);
  }, []);

  // Always read rate fresh from `rates` — avoids stale closure bugs
  const getRate = useCallback(
    (code: string): number => {
      if (!rates) return 0;
      return rates[code as keyof ExchangeRates] ?? 0;
    },
    [rates],
  );

  const convertPrice = useCallback(
    (priceInCNY: number): number => {
      const rate = getRate(currencyCode);
      return priceInCNY * rate;
    },
    [currencyCode, getRate],
  );

  const formatPrice = useCallback(
    (priceInCNY: number): string => {
      const converted = convertPrice(priceInCNY);
      const symbol = CURRENCY_META[currencyCode]?.symbol ?? "₦";
      return `${symbol}${converted.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    [convertPrice, currencyCode],
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency: CURRENCY_META[currencyCode],
        setCurrency,
        convertPrice,
        formatPrice,
        availableCurrencies: Object.values(CURRENCY_META),
        isLoading: ratesLoading,
        error: ratesError || locationError,
        rates: rates ?? null,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context)
    throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
