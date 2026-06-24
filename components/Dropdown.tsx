"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import exchangerates, { type ExCurr } from "./ChangeMoney/exCurr";
import { useCurrency } from "./CurrencyContext";

type Props = {
  purpose?: string;
  method?: string;
  setMethod?: Dispatch<SetStateAction<string>>;
  setPurpose?: Dispatch<SetStateAction<string>>;
  type?: "booking" | "exchange" | "method";
  currency?: string;
  setCurrency?: Dispatch<SetStateAction<string>>;
  setSelectedCurr?: Dispatch<SetStateAction<ExCurr | null>>;
};

export function Dropdown({
  purpose,
  setPurpose,
  method,
  setMethod,
  type,
  currency,
  setCurrency,
  setSelectedCurr,
}: Props) {
  const { rates } = useCurrency();

  // All rates in CurrencyContext are "units of that currency per 1 CNY (Yuan)".
  // NGN = Naira per 1 Yuan  |  USD ≈ USDT per 1 Yuan  |  CNY = 1 (base)
  const availableRates: ExCurr[] = useMemo(() => {
    return exchangerates
      .filter((r) => r.available)
      .map((r) => {
        let liveRate = r.rate;

        if (r.from === "Naira" && r.to === "Yuan" && rates?.NGN) {
          // 1 Naira = 1/NGN Yuan
          liveRate = 1 / rates.NGN;
        }

        if (r.from === "Yuan" && r.to === "Naira" && rates?.NGN) {
          // 1 Yuan = NGN Naira
          liveRate = rates.NGN;
        }

        if (r.from === "USDT" && r.to === "Yuan" && rates?.USD) {
          // 1 USDT ≈ 1 USD = 1/USD Yuan
          liveRate = 1 / rates.USD;
        }

        if (r.from === "Yuan" && r.to === "USDT" && rates?.USD) {
          // 1 Yuan = USD USDT
          liveRate = rates.USD;
        }

        return { ...r, rate: liveRate };
      });
  }, [rates]);

  function handleCurr(selectedCurr: ExCurr) {
    setSelectedCurr!(selectedCurr);
  }

  return (
    <div className={`${type === "booking" ? "w-80" : "w-full"}`}>
      {type === "booking" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {purpose === "" ? "Select purpose" : purpose} <ArrowDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup value={purpose} onValueChange={setPurpose}>
              <DropdownMenuRadioItem value="Factory Visit">
                Factory Visit
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Tour Guide">
                Tour Guide
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {type === "exchange" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="w-full rounded-md">
            <div className="border flex flex-row justify-between items-center rounded-md w-full cursor-pointer">
              <p className="text-sm font-semibold px-2">
                {currency ? currency : "Choose Currency"}
              </p>
              <Button variant="ghost" className="border-0">
                <ArrowDown />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuRadioGroup
              value={currency}
              onValueChange={(value) => {
                setCurrency!(value);
                const selectedRate = availableRates.find(
                  (r) => `${r.from} - ${r.to}` === value,
                );
                if (selectedRate) {
                  handleCurr(selectedRate);
                }
              }}
            >
              {availableRates.map((rate) => (
                <DropdownMenuRadioItem
                  key={`${rate.from}-${rate.to}`}
                  value={`${rate.from} - ${rate.to}`}
                >
                  {rate.from} → {rate.to}
                  {rate.rate > 0 && (
                    <span className="ml-auto text-xs text-gray-400">
                      ={rate.rate.toFixed(4)}
                    </span>
                  )}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {type === "method" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="border flex flex-row justify-between items-center rounded-md w-full cursor-pointer">
              <p className="text-sm font-semibold px-2">
                {method ? method : "Payment Method"}
              </p>
              <Button variant="ghost" className="border-0">
                <ArrowDown />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuRadioGroup value={method} onValueChange={setMethod}>
              <DropdownMenuRadioItem value="Bank Transfer">
                Bank Transfer
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="QR Code">
                QR Code
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
