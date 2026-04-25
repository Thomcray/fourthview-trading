"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
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
  convertPrice: (priceInCNY: number) => number | null;
  formatPrice: (priceInCNY: number) => string | null;
  formatFromNGN: (amountInNGN: number) => string | null;
  availableCurrencies: Currency[];
  isLoading: boolean;
  error: string | null;
  rates: ExchangeRates | null;
  country: string | null;
};

const CURRENCY_META: Record<string, Currency> = {
  NGN: { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  USD: { code: "USD", symbol: "$", name: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", name: "Euro" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound" },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  CNY: { code: "CNY", symbol: "¥", name: "Chinese Yuan" }, // Fix: was missing
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
  CN: "CNY",
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
  const [locationLoading, setLocationLoading] = useState(true);
  const [countryCode, setCountryCode] = useState<string | null>(null);

  // ref guard prevents re-running if rates reload (e.g. on a refresh interval)
  const hasDetected = useRef(false);

  useEffect(() => {
    if (ratesLoading || hasDetected.current) return;
    hasDetected.current = true;

    // Honour explicit user preference first
    const saved = localStorage.getItem("preferredCurrency");
    if (saved && CURRENCY_META[saved]) {
      setCurrencyCode(saved);
      const savedCountry = localStorage.getItem("detectedCountry");
      if (savedCountry) setCountryCode(savedCountry);
      setLocationLoading(false);
      return;
    }

    // call our own API route instead of ipapi.co directly
    fetch("/api/location")
      .then((res) => res.json())
      .then((data) => {
        console.log("location response:", data);
        const code = data.country_code;
        setCountryCode(code);
        if (code) localStorage.setItem("detectedCountry", code);
        const detected = (code && COUNTRY_CURRENCY_MAP[code]) || "NGN";
        setCurrencyCode(detected);
      })
      .catch(() => {
        setLocationError("Could not detect location");
        setCurrencyCode("NGN");
      })
      .finally(() => {
        setLocationLoading(false);
      });
  }, [ratesLoading]);

  const setCurrency = useCallback((code: string) => {
    if (!CURRENCY_META[code]) return;
    setCurrencyCode(code);
    localStorage.setItem("preferredCurrency", code);
  }, []);

  const getRate = useCallback(
    (code: string): number | null => {
      if (!rates) return null;
      const rate = rates[code as keyof ExchangeRates];
      // return null instead of 0 so callers can show skeleton vs ₦0.00
      return rate ?? null;
    },
    [rates],
  );

  // returns null when rates aren't ready — callers should show skeleton
  const convertPrice = useCallback(
    (priceInCNY: number): number | null => {
      const rate = getRate(currencyCode);
      if (rate === null) return null;
      return priceInCNY * rate;
    },
    [currencyCode, getRate],
  );

  // returns null when rates aren't ready — callers should show skeleton
  const formatPrice = useCallback(
    (priceInCNY: number): string | null => {
      const converted = convertPrice(priceInCNY);
      if (converted === null) return null;
      const symbol = CURRENCY_META[currencyCode]?.symbol ?? "₦";
      return `${symbol}${converted.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    [convertPrice, currencyCode],
  );

  const formatFromNGN = useCallback(
    (amountInNGN: number): string | null => {
      if (!rates) return null;
      const inCNY = amountInNGN / rates.NGN;
      return formatPrice(inCNY);
    },
    [rates, formatPrice],
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency: CURRENCY_META[currencyCode],
        setCurrency,
        convertPrice,
        formatPrice,
        formatFromNGN,
        availableCurrencies: Object.values(CURRENCY_META),
        isLoading: ratesLoading || locationLoading,
        error: ratesError || locationError,
        rates: rates ?? null,
        country: countryCode,
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
