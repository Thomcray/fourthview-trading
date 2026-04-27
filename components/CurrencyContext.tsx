"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useExchangeSettings } from "@/hooks/useExchangeSettings";
import { useExchangeRates } from "@/hooks/useExchangeRates";

type Currency = {
  code: string;
  symbol: string;
  name: string;
};

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
  margin: number; // expose margin for transparency
};

const CURRENCY_META: Record<string, Currency> = {
  NGN: { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  GHS: { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" },
  USD: { code: "USD", symbol: "$", name: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", name: "Euro" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound" },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  CNY: { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
};

const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  NG: "NGN",
  GH: "GHS",
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
  // Use React Query hook
  const {
    data: rates,
    isLoading: ratesLoading,
    error: ratesError,
  } = useExchangeRates();
  const {
    data: settings,
    isLoading: settingsLoading,
    error: settingsError,
  } = useExchangeSettings();

  const [currencyCode, setCurrencyCode] = useState<string>("NGN");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [countryCode, setCountryCode] = useState<string | null>(null);

  const hasDetected = useRef(false);

  // Apply margin to rates
  const effectiveRates = useMemo<ExchangeRates | null>(() => {
    if (!rates || !settings) return null;
    const multiplier = 1 + settings.rateMargin / 100;
    return {
      NGN: rates.NGN * multiplier,
      GHS: rates.GHS * multiplier,
      USD: rates.USD * multiplier,
      EUR: rates.EUR * multiplier,
      GBP: rates.GBP * multiplier,
      CAD: rates.CAD * multiplier,
      AUD: rates.AUD * multiplier,
      CNY: rates.CNY * multiplier,
    };
  }, [rates, settings]);

  useEffect(() => {
    if (ratesLoading || settingsLoading || hasDetected.current) return;
    hasDetected.current = true;

    const saved = localStorage.getItem("preferredCurrency");
    if (saved && CURRENCY_META[saved]) {
      setCurrencyCode(saved);
      const savedCountry = localStorage.getItem("detectedCountry");
      if (savedCountry) setCountryCode(savedCountry);
      setLocationLoading(false);
      return;
    }

    fetch("/api/location")
      .then((res) => res.json())
      .then((data) => {
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
  }, [ratesLoading, settingsLoading]);

  const setCurrency = useCallback((code: string) => {
    if (!CURRENCY_META[code]) return;
    setCurrencyCode(code);
    localStorage.setItem("preferredCurrency", code);
  }, []);

  const getRate = useCallback(
    (code: string): number | null => {
      if (!effectiveRates) return null;
      const rate = effectiveRates[code as keyof ExchangeRates];
      return rate ?? null;
    },
    [effectiveRates],
  );

  const convertPrice = useCallback(
    (priceInCNY: number): number | null => {
      const rate = getRate(currencyCode);
      if (rate === null) return null;
      return priceInCNY * rate;
    },
    [currencyCode, getRate],
  );

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
      if (!effectiveRates) return null;
      const inCNY = amountInNGN / effectiveRates.NGN;
      return formatPrice(inCNY);
    },
    [effectiveRates, formatPrice],
  );

  const isLoading = ratesLoading || settingsLoading || locationLoading;
  const error = ratesError?.message || locationError || null;
  const margin = settings?.rateMargin ?? 0;

  return (
    <CurrencyContext.Provider
      value={{
        currency: CURRENCY_META[currencyCode],
        setCurrency,
        convertPrice,
        formatPrice,
        formatFromNGN,
        availableCurrencies: Object.values(CURRENCY_META),
        isLoading,
        error,
        rates: effectiveRates,
        country: countryCode,
        margin,
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
