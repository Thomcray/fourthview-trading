"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Save,
  Clock,
  Percent,
  Info,
  History,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  useExchangeSettings,
  useUpdateExchangeSettings,
} from "@/hooks/useExchangeSettings";
import { useExchangeRates, useRefreshRates } from "@/hooks/useExchangeRates";

const CURRENCY_LABELS: Record<string, { name: string }> = {
  NGN: { name: "Nigerian Naira" },
  GHS: { name: "Ghanaian Cedi" },
  USD: { name: "US Dollar" },
  EUR: { name: "Euro" },
  GBP: { name: "British Pound" },
  CAD: { name: "Canadian Dollar" },
  AUD: { name: "Australian Dollar" },
};

export default function ExchangeRateSettings() {
  const { data: serverSettings, isLoading: isLoadingSettings } =
    useExchangeSettings();
  const updateSettings = useUpdateExchangeSettings();
  const { data: rates, isLoading: isLoadingRates } = useExchangeRates();
  const { refresh: refreshRates, isRefreshing } = useRefreshRates();

  const [localSettings, setLocalSettings] = useState({
    autoUpdate: true,
    updateInterval: 60,
    rateMargin: 0,
    rateMarginInput: "0", // ← raw input string
  });
  const [reason, setReason] = useState("");
  const [showReason, setShowReason] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Sync with server settings
  useEffect(() => {
    if (serverSettings) {
      const margin = serverSettings.rateMargin ?? 0;
      setLocalSettings({
        autoUpdate: serverSettings.autoUpdate ?? true,
        updateInterval: serverSettings.updateInterval ?? 60,
        rateMargin: margin,
        rateMarginInput: String(margin),
      });
      setIsDirty(false);
    }
  }, [serverSettings]);

  const handleChange = (key: keyof typeof localSettings, value: unknown) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleMarginChange = (raw: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      rateMarginInput: raw,
      rateMargin: raw === "" ? 0 : Number(raw),
    }));
    setIsDirty(true);
    if (Number(raw) !== (serverSettings?.rateMargin ?? 0)) {
      setShowReason(true);
    }
  };

  const handleSave = () => {
    if (
      localSettings.rateMargin !== (serverSettings?.rateMargin ?? 0) &&
      !reason.trim()
    ) {
      toast.error("Please provide a reason for changing the margin");
      return;
    }

    updateSettings.mutate(
      {
        autoUpdate: localSettings.autoUpdate,
        updateInterval: localSettings.updateInterval,
        rateMargin: localSettings.rateMargin,
        reason: reason.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Settings saved and applied globally!");
          setIsDirty(false);
          setShowReason(false);
          setReason("");
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };

  const handleCancel = () => {
    if (serverSettings) {
      const margin = serverSettings.rateMargin ?? 0;
      setLocalSettings({
        autoUpdate: serverSettings.autoUpdate ?? true,
        updateInterval: serverSettings.updateInterval ?? 60,
        rateMargin: margin,
        rateMarginInput: String(margin),
      });
    }
    setIsDirty(false);
    setShowReason(false);
    setReason("");
  };

  const getEffectiveRate = (rate: number) => {
    const margin =
      localSettings.rateMarginInput === ""
        ? 0
        : Number(localSettings.rateMarginInput);
    return rate * (1 + margin / 100);
  };

  const isLoading = isLoadingSettings || isLoadingRates;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Exchange Rate Configuration
          </h3>
          <p className="text-sm text-gray-500">
            Global margin applied to all customer-facing prices
          </p>
        </div>
        <AnimatePresence>
          {isDirty && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full"
            >
              <AlertCircle className="w-3 h-3" />
              Unsaved changes
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live Rates */}
      <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium text-blue-800">
              Effective Rates (
              {localSettings.rateMarginInput === ""
                ? "0"
                : localSettings.rateMarginInput}
              % margin)
            </p>
          </div>
          <Button
            onClick={() => refreshRates()}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-blue-50 border-blue-300 cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh Rates"}
          </Button>
        </div>

        {rates ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(CURRENCY_LABELS).map(([code, { name }]) => {
              const rate = rates[code as keyof typeof rates];
              if (typeof rate !== "number") return null;
              return (
                <div
                  key={code}
                  className="bg-white rounded-lg p-3 border border-blue-100"
                >
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                    {code}
                  </span>
                  <p className="text-lg font-bold text-blue-900 mt-1">
                    {getEffectiveRate(rate).toFixed(4)}
                  </p>
                  <p className="text-xs text-gray-500">{name}</p>
                  {(localSettings.rateMarginInput === ""
                    ? 0
                    : Number(localSettings.rateMarginInput)) > 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      base: {rate.toFixed(4)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Failed to load rates
          </div>
        )}
      </div>

      {/* Settings Form */}
      <div className="space-y-6">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <Label className="font-medium text-gray-800">
              Auto-update Rates
            </Label>
            <p className="text-sm text-gray-500">
              Fetch latest rates automatically
            </p>
          </div>
          <Switch
            checked={localSettings.autoUpdate}
            onCheckedChange={(checked) => handleChange("autoUpdate", checked)}
          />
        </div>

        <AnimatePresence>
          {localSettings.autoUpdate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-4 border-l-2 border-blue-200 overflow-hidden"
            >
              <Label className="font-medium text-gray-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                Update Interval
              </Label>
              <div className="flex items-center gap-3 mt-2">
                <Input
                  type="number"
                  value={localSettings.updateInterval}
                  onChange={(e) =>
                    handleChange("updateInterval", Number(e.target.value))
                  }
                  className="w-32"
                  min={15}
                  max={1440}
                  step={15}
                />
                <span className="text-sm text-gray-500">minutes</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-2">
          <Label className="font-medium text-gray-800 flex items-center gap-2">
            <Percent className="w-4 h-4 text-gray-500" />
            Rate Margin (%)
          </Label>
          <div className="flex items-center gap-3 mt-2">
            <Input
              type="number"
              value={localSettings.rateMarginInput}
              onChange={(e) => handleMarginChange(e.target.value)}
              className="w-32"
              step={0.5}
              min={0}
              max={100}
            />
            <span className="text-sm text-gray-500">
              markup on all conversions
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Applied globally to cover fees, risk, or profit
          </p>
        </div>

        <AnimatePresence>
          {showReason && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <Label className="text-sm font-medium text-amber-700 flex items-center gap-2">
                <History className="w-4 h-4" />
                Reason for Margin Change (required for audit log)
              </Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Increased processing fees from payment provider"
                className="w-full"
                rows={2}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <div className="text-xs text-gray-400">
          {serverSettings?.updatedAt && (
            <span>
              Last updated:{" "}
              {new Date(serverSettings.updatedAt).toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={updateSettings.isPending || !isDirty}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending || !isDirty}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer"
          >
            {updateSettings.isPending ? (
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
      </div>

      {!isDirty && !updateSettings.isPending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-end gap-1 text-xs text-green-600"
        >
          <CheckCircle className="w-3 h-3" />
          All settings saved and active
        </motion.div>
      )}
    </div>
  );
}
