"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Save,
  Clock,
  Percent,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

type ExchangeRates = {
  NGN: number;
  USD: number;
  EUR: number;
  GBP: number;
  CAD: number;
  AUD: number;
  CNY: number;
};

const CURRENCY_LABELS: Record<string, { name: string; symbol: string }> = {
  NGN: { name: "Nigerian Naira", symbol: "₦" },
  USD: { name: "US Dollar", symbol: "$" },
  EUR: { name: "Euro", symbol: "€" },
  GBP: { name: "British Pound", symbol: "£" },
  CAD: { name: "Canadian Dollar", symbol: "C$" },
  AUD: { name: "Australian Dollar", symbol: "A$" },
};

export default function ExchangeRateSettings() {
  const [settings, setSettings] = useState({
    autoUpdate: true,
    updateInterval: 60,
    rateMargin: 0,
  });
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchCurrentRates();
  }, []);

  const fetchCurrentRates = async () => {
    try {
      const res = await fetch("/api/exchange-rate");
      if (!res.ok) throw new Error("Failed to fetch rates");
      const data: ExchangeRates = await res.json();
      setRates(data);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Failed to fetch rates:", error);
      toast.error("Failed to fetch exchange rates");
    }
  };

  const handleManualUpdate = async () => {
    setIsLoading(true);
    try {
      // Force a cache bypass by appending a timestamp
      const res = await fetch(`/api/exchange-rate?t=${Date.now()}`);
      if (!res.ok) throw new Error("Failed to refresh rates");
      const data: ExchangeRates = await res.json();
      setRates(data);
      setLastUpdated(new Date().toLocaleString());
      toast.success("Exchange rates updated successfully!");
    } catch (error) {
      toast.error("Failed to update exchange rates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Settings are UI-only for now (autoUpdate/interval are server-side concerns)
      // Persist margin to localStorage until a settings API is available
      localStorage.setItem("exchangeRateSettings", JSON.stringify(settings));
      toast.success("Settings saved!");
      setIsDirty(false);
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleCancel = () => {
    const saved = localStorage.getItem("exchangeRateSettings");
    if (saved) setSettings(JSON.parse(saved));
    setIsDirty(false);
  };

  const getEffectiveRate = (rate: number) =>
    rate * (1 + settings.rateMargin / 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Exchange Rate Configuration
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Live rates from CNY to all supported currencies
          </p>
        </div>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full"
          >
            <AlertCircle className="w-3 h-3" />
            Unsaved changes
          </motion.div>
        )}
      </div>

      {/* All Rates Grid */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium text-blue-800">
              Current Exchange Rates (Base: CNY)
            </p>
          </div>
          <Button
            onClick={handleManualUpdate}
            disabled={isLoading}
            variant="outline"
            className="bg-white hover:bg-blue-50 border-blue-300"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Updating..." : "Refresh"}
          </Button>
        </div>

        {rates ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(CURRENCY_LABELS).map(([code, { name, symbol }]) => {
              const rate = rates[code as keyof ExchangeRates];
              const effective = getEffectiveRate(rate);
              return (
                <div
                  key={code}
                  className="bg-white rounded-lg p-3 border border-blue-100"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {code}
                    </span>
                    <span className="text-xs text-gray-400">{symbol}</span>
                  </div>
                  <p className="text-lg font-bold text-blue-900">
                    {rate.toFixed(4)}
                  </p>
                  <p className="text-xs text-gray-500">{name}</p>
                  {settings.rateMargin > 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      +{settings.rateMargin}%: {effective.toFixed(4)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.keys(CURRENCY_LABELS).map((code) => (
              <div
                key={code}
                className="bg-white rounded-lg p-3 border border-blue-100 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded mb-2 w-12" />
                <div className="h-6 bg-gray-200 rounded mb-1" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {lastUpdated && (
          <p className="text-xs text-blue-600 mt-3">
            Last updated: {lastUpdated}
          </p>
        )}
      </div>

      {/* Settings Form */}
      <div className="space-y-6">
        {/* Auto Update Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <Label className="font-medium text-gray-800">
              Auto-update Rates
            </Label>
            <p className="text-sm text-gray-500">
              Automatically fetch the latest exchange rates
            </p>
          </div>
          <Switch
            checked={settings.autoUpdate}
            onCheckedChange={(checked) =>
              handleSettingChange("autoUpdate", checked)
            }
          />
        </div>

        {/* Update Interval */}
        {settings.autoUpdate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-4 border-l-2 border-blue-200"
          >
            <Label className="font-medium text-gray-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              Update Interval
            </Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                type="number"
                value={settings.updateInterval}
                onChange={(e) =>
                  handleSettingChange("updateInterval", Number(e.target.value))
                }
                className="w-32"
                min={15}
                max={1440}
                step={15}
              />
              <span className="text-sm text-gray-500">minutes</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              How often to fetch new rates (15–1440 minutes)
            </p>
          </motion.div>
        )}

        {/* Rate Margin */}
        <div className="pt-2">
          <Label className="font-medium text-gray-800 flex items-center gap-2">
            <Percent className="w-4 h-4 text-gray-500" />
            Rate Margin (%)
          </Label>
          <div className="flex items-center gap-3 mt-2">
            <Input
              type="number"
              value={settings.rateMargin}
              onChange={(e) =>
                handleSettingChange("rateMargin", Number(e.target.value))
              }
              className="w-32"
              step={0.5}
              min={0}
              max={20}
            />
            <span className="text-sm text-gray-500">markup</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Add a percentage margin to cover transaction fees
          </p>
        </div>

        {/* Effective Rate Preview */}
        {settings.rateMargin > 0 && rates && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 rounded-lg p-4 border border-amber-200"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Effective Rates with {settings.rateMargin}% margin
                </p>
                <div className="mt-2 space-y-1">
                  {Object.entries(CURRENCY_LABELS).map(([code, { symbol }]) => (
                    <p key={code} className="text-sm text-amber-700">
                      1 CNY ={" "}
                      {getEffectiveRate(
                        rates[code as keyof ExchangeRates],
                      ).toFixed(4)}{" "}
                      {code}
                    </p>
                  ))}
                </div>
                <p className="text-xs text-amber-600 mt-2">
                  These are the rates customers will see at checkout
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving || !isDirty}
        >
          Cancel
        </Button>
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
              Save Changes
            </>
          )}
        </Button>
      </div>

      {!isDirty && !isSaving && (
        <div className="flex items-center justify-end gap-1 text-xs text-green-600">
          <CheckCircle className="w-3 h-3" />
          All settings saved
        </div>
      )}
    </div>
  );
}
