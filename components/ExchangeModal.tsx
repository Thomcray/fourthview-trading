// components/ExchangeModal.tsx
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
import { useState, useEffect } from "react";
import { Label } from "./ui/label";
import {
  ArrowRightLeft,
  RefreshCw,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  CreditCard,
} from "lucide-react";

type ExCurr = {
  from: string;
  to: string;
  rate: number;
  available: boolean;
};

export function ExchangeModal() {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [toValue, setToValue] = useState<number | null>(null);
  const [fromValue, setFromValue] = useState<number | null>(null);
  const [selectedCurr, setSelectedCurr] = useState<ExCurr | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Reset form when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setTimeout(() => {
        setToValue(null);
        setFromValue(null);
        setCurrency("");
        setMethod("");
        setSelectedCurr(null);
        setUploadedFile(null);
      }, 300);
    }
  };

  // Calculate exchange rate when toValue or selectedCurr changes
  useEffect(() => {
    if (selectedCurr && toValue && toValue > 0) {
      setIsCalculating(true);
      const calculatedFrom = toValue * selectedCurr.rate;
      setTimeout(() => {
        setFromValue(Number(calculatedFrom.toFixed(2)));
        setIsCalculating(false);
      }, 300);
    } else if (toValue === 0) {
      setFromValue(0);
    }
  }, [toValue, selectedCurr]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const isFormValid = () => {
    return (
      selectedCurr &&
      toValue &&
      toValue > 0 &&
      method &&
      uploadedFile &&
      selectedCurr.available
    );
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      // console.log({
      //   currency: selectedCurr,
      //   amount: toValue,
      //   convertedAmount: fromValue,
      //   paymentMethod: method,
      //   receipt: uploadedFile,
      // });
      alert("Exchange request submitted successfully!");
      handleOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-linear-to-r from-blue-600 to-blue-700 text-white flex cursor-pointer py-6 px-8 font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          Get Started
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-blue-950 flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-blue-600" />
            Currency Exchange
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Currency Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Select Currency Pair
            </Label>
            <Dropdown
              type="exchange"
              currency={currency}
              setCurrency={setCurrency}
              setSelectedCurr={setSelectedCurr}
            />
            {selectedCurr && !selectedCurr.available && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                <span>This currency pair is currently unavailable</span>
              </div>
            )}
          </div>

          {/* Exchange Rate Display */}
          {selectedCurr && selectedCurr.available && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Exchange Rate</p>
                  <p className="text-2xl font-bold text-blue-900">
                    1 {selectedCurr.from} = {selectedCurr.rate.toFixed(4)}{" "}
                    {selectedCurr.to}
                  </p>
                </div>
                <RefreshCw className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          )}

          {/* Amount Conversion */}
          {selectedCurr && selectedCurr.available && (
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700">
                Amount to Exchange
              </Label>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">You send</p>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={toValue || ""}
                      onChange={(e) => setToValue(Number(e.target.value))}
                      className="pl-12 py-6 text-lg"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      {selectedCurr.from}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <ArrowRightLeft className="w-4 h-4 text-gray-500" />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">You receive</p>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={fromValue?.toString() || ""}
                      readOnly
                      className={`pl-12 py-6 text-lg bg-gray-50 ${isCalculating ? "opacity-50" : ""}`}
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      {selectedCurr.to}
                    </span>
                    {isCalculating && (
                      <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          {selectedCurr && selectedCurr.available && toValue && toValue > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Payment Method
              </Label>
              <Dropdown type="method" method={method} setMethod={setMethod} />
              {method && (
                <div className="flex items-center gap-2 text-green-600 text-sm mt-1">
                  <CreditCard className="w-4 h-4" />
                  <span>Secure payment processing</span>
                </div>
              )}
            </div>
          )}

          {/* Payment Receipt Upload */}
          {method && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Payment Receipt
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                {!uploadedFile ? (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, PDF (Max 5MB)
                    </p>
                  </label>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4 gap-3">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="px-6">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6"
          >
            Submit Exchange Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
