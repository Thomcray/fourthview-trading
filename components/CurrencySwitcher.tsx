"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const currencies = [
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

export default function CurrencySwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  useEffect(() => {
    const saved = localStorage.getItem("preferredCurrency");
    if (saved) {
      const found = currencies.find((c) => c.code === saved);
      if (found) setSelectedCurrency(found);
    }
  }, []);

  const switchCurrency = (currency: (typeof currencies)[0]) => {
    setSelectedCurrency(currency);
    localStorage.setItem("preferredCurrency", currency.code);
    // Reload to refresh all prices
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-400 transition-colors bg-white shadow-sm"
      >
        <span className="text-lg">{selectedCurrency.symbol}</span>
        <span className="text-sm font-medium">{selectedCurrency.code}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => {
                  switchCurrency(currency);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-4 py-2 text-sm
                  hover:bg-gray-50 transition-colors
                  ${selectedCurrency.code === currency.code ? "bg-blue-50 text-blue-600" : "text-gray-700"}
                `}
              >
                <span>
                  {currency.symbol} {currency.code}
                </span>
                <span className="text-xs text-gray-400">{currency.name}</span>
                {selectedCurrency.code === currency.code && (
                  <span className="text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
