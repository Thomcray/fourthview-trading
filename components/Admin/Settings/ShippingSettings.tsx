"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Truck,
  Save,
  CheckCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useCurrency } from "@/components/CurrencyContext";

type ShippingConfig = {
  rate_per_kg: number;
  base_rate: number;
  free_shipping_threshold: number;
  currency: string;
};

export default function ShippingSettings() {
  const { formatPrice } = useCurrency();

  const [config, setConfig] = useState<ShippingConfig>({
    rate_per_kg: 15,
    base_rate: 0,
    free_shipping_threshold: 500,
    currency: "CNY",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Load from DB on mount
  useEffect(() => {
    fetch("/api/shipping-config")
      .then((res) => res.json())
      .then((data) => {
        if (data) setConfig(data);
      })
      .catch(() => toast.error("Failed to load shipping config"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (
    field: keyof ShippingConfig,
    value: number | string,
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/shipping-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success("Shipping rates saved to database (CNY)");
      setIsDirty(false);
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            Shipping Configuration
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Rates stored in CNY (¥) - converted to user&apos;s currency at
            display
          </p>
        </div>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full"
          >
            <AlertCircle className="w-3 h-3" />
            Unsaved changes
          </motion.div>
        )}
      </div>

      {/* Rate per KG */}
      <div className="space-y-3">
        <Label className="font-medium flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          Rate per Kilogram (¥)
        </Label>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            ¥
          </span>
          <Input
            type="number"
            step="0.01"
            min="0"
            className="pl-8"
            value={config.rate_per_kg}
            onChange={(e) =>
              handleChange("rate_per_kg", Number(e.target.value))
            }
          />
        </div>
        <p className="text-xs text-gray-500">
          Example: 2kg product = {formatPrice(config.rate_per_kg * 2)} shipping
        </p>
      </div>

      {/* Base Rate */}
      <div className="space-y-3">
        <Label className="font-medium">Base Handling Rate (¥)</Label>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            ¥
          </span>
          <Input
            type="number"
            step="0.01"
            min="0"
            className="pl-8"
            value={config.base_rate}
            onChange={(e) => handleChange("base_rate", Number(e.target.value))}
          />
        </div>
        <p className="text-xs text-gray-500">
          Fixed fee added to every order (handling/packaging)
        </p>
      </div>

      {/* Free Shipping Threshold */}
      <div className="space-y-3">
        <Label className="font-medium">Free Shipping Threshold (¥)</Label>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            ¥
          </span>
          <Input
            type="number"
            step="0.01"
            min="0"
            className="pl-8"
            value={config.free_shipping_threshold}
            onChange={(e) =>
              handleChange("free_shipping_threshold", Number(e.target.value))
            }
          />
        </div>
        <p className="text-xs text-gray-500">
          Orders above this amount get free shipping (
          {formatPrice(config.free_shipping_threshold)})
        </p>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-3">Sample Calculations</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[0.5, 1, 2, 5, 10].map((kg) => {
            const cost = kg * config.rate_per_kg + config.base_rate;
            return (
              <div key={kg} className="flex justify-between">
                <span className="text-gray-600">{kg}kg:</span>
                <span className="font-medium">{formatPrice(cost)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <Button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save to Database
            </>
          )}
        </Button>
      </div>

      {!isDirty && !isSaving && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-end gap-1 text-xs text-green-600"
        >
          <CheckCircle className="w-3 h-3" />
          All settings saved to database
        </motion.div>
      )}
    </div>
  );
}
