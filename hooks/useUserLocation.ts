"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

type UserLocation = {
  country: string;
  currency: string;
  symbol: string;
  rate: number;
  code: string;
};

const currencyMap: Record<string, UserLocation> = {
  NG: { country: "Nigeria", currency: "NGN", symbol: "₦", rate: 1, code: "NG" },
  US: {
    country: "United States",
    currency: "USD",
    symbol: "$",
    rate: 0.00066,
    code: "US",
  },
  GB: {
    country: "United Kingdom",
    currency: "GBP",
    symbol: "£",
    rate: 0.00052,
    code: "GB",
  },
  CA: {
    country: "Canada",
    currency: "CAD",
    symbol: "C$",
    rate: 0.00089,
    code: "CA",
  },
  AU: {
    country: "Australia",
    currency: "AUD",
    symbol: "A$",
    rate: 0.00099,
    code: "AU",
  },
  // Add more countries as needed
};

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try to get from localStorage first
        const saved = localStorage.getItem("userCurrency");
        if (saved) {
          setLocation(JSON.parse(saved));
          setLoading(false);
          return;
        }

        // Fetch from IP API
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        const countryCode = data.country_code;
        const userCurrency = currencyMap[countryCode] || currencyMap.NG;

        // Fetch live exchange rate if not NGN
        let rate = userCurrency.rate;
        if (countryCode !== "NG") {
          const rateRes = await fetch(
            `https://api.exchangerate-api.com/v4/latest/NGN`,
          );
          const rateData = await rateRes.json();
          rate = rateData.rates[userCurrency.currency] || userCurrency.rate;
          userCurrency.rate = rate;
        }

        localStorage.setItem("userCurrency", JSON.stringify(userCurrency));
        setLocation(userCurrency);
      } catch (err) {
        console.error("Location detection failed:", err);
        // Fallback to NGN
        setLocation(currencyMap.NG);
        setError("Could not detect location, defaulting to NGN");
      } finally {
        setLoading(false);
      }
    };

    detectLocation();
  }, []);

  const switchCurrency = (currencyCode: string) => {
    const newLocation = Object.values(currencyMap).find(
      (c) => c.code === currencyCode,
    );
    if (newLocation) {
      localStorage.setItem("userCurrency", JSON.stringify(newLocation));
      setLocation(newLocation);
      window.location.reload();
    }
  };

  return { location, loading, error, switchCurrency };
}
