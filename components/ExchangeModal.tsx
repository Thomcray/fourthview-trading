"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Dropdown } from "./Dropdown";
import { useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "./ui/label";
import Image from "next/image";

type ExCurr = {
  from: string;
  to: string;
  rate: number;
  available: boolean;
};

export function ExchangeModal() {
  const [method, setMethod] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [toValue, setToValue] = useState<number | null>(null);
  const [fromValue, setFromValue] = useState<number | null>(null);
  const [selectedCurr, setSelectedCurr] = useState<ExCurr | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white text-blue-950 flex curosor-pointer py-6 px-8 cursor-pointer font-semibold hover:bg-blue-100"
        >
          Get Started
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Currency Exchange</DialogTitle>

          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Dropdown
              type="exchange"
              currency={currency}
              setCurrency={setCurrency}
              setSelectedCurr={setSelectedCurr}
            />

            <div className="flex items-center gap-2 w-full">
              <Input
                type="number"
                placeholder="0.00"
                value={toValue || ""}
                onChange={(e) => {
                  setToValue(Number(e.target.value));

                  if (selectedCurr) {
                    const calculatedFrom =
                      Number(e.target.value) * selectedCurr.rate;
                    setFromValue(
                      calculatedFrom.toFixed(2) as unknown as number
                    );
                  }
                }}
                className="w-full"
              />
              -
              <Input
                type="number"
                placeholder="0.00"
                value={fromValue?.toString() || ""}
                readOnly
                className="w-full"
              />
            </div>

            <Dropdown type="method" method={method} setMethod={setMethod} />

            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="picture">Payment Receipt</Label>
              <Input
                id="picture"
                type="file"
                accept="image/*,.pdf"
                className=""
              />

              {/* <Image
                src="/assets/images/payment-example.png"
                alt="example"
                width={300}
                height={200}
                className="rounded-md border"
              /> */}
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
