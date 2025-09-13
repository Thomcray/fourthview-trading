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
import { Dispatch, SetStateAction } from "react";
import exchangerates from "./ChangeMoney/exCurr";

type ExCurr = {
  from: string;
  to: string;
  rate: number;
  available: boolean;
};

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
  function handleCurr(selectedCurr: ExCurr) {
    setSelectedCurr && setSelectedCurr(selectedCurr);
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
            {/* <DropdownMenuLabel>Please select purpose</DropdownMenuLabel> */}
            {/* <DropdownMenuSeparator /> */}
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
            <div className="border flex flex-row justify-between items-center rounded-md w-full">
              <p className="text-sm text-semibold px-2">
                {currency ? currency : " Choose Currency"}
              </p>
              <Button variant="ghost" className="border-0">
                <ArrowDown />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 border-0" align="end">
            {/* <DropdownMenuLabel>Please select purpose</DropdownMenuLabel> */}
            {/* <DropdownMenuSeparator /> */}
            {exchangerates.map((rate) => (
              <DropdownMenuRadioGroup
                value={currency}
                onValueChange={(value) => {
                  setCurrency && setCurrency(value);

                  const selectedRate = exchangerates.find(
                    (r) => r.from + " - " + r.to === value
                  );

                  if (selectedRate) {
                    handleCurr(selectedRate);
                  }
                }}
                key={`${rate.from}-${rate.to}`}
              >
                <DropdownMenuRadioItem value={rate.from + " - " + rate.to}>
                  {rate.from} - {rate.to}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {type === "method" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="border flex flex-row justify-between items-center rounded-md w-full">
              <p className="text-sm text-semibold px-2">
                {method ? method : "Payment Method"}
              </p>
              <Button variant="ghost" className="border-0">
                <ArrowDown />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            {/* <DropdownMenuLabel>Please select purpose</DropdownMenuLabel> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuRadioGroup value={method} onValueChange={setMethod}>
              <DropdownMenuRadioItem value="Bank Transfer">
                Bank Transfer
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Mobile Money">
                Mobile Money
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
