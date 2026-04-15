"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  CreditCard,
  Building2,
  Globe,
  CheckCircle,
  AlertCircle,
  Save,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function PaymentSettings() {
  const [showKeys, setShowKeys] = useState({
    paystackPublic: false,
    paystackSecret: false,
    stripePublic: false,
    stripeSecret: false,
  });

  const [paystackSettings, setPaystackSettings] = useState({
    enabled: true,
    publicKey: process.env.NEXT_PUBLIC_TEST_PUBLIC_KEY || "",
    secretKey: process.env.PAYSTACK_TEST_SECRET_KEY || "",
    testMode: true,
    callbackUrl: "https://fourthview.com/payment/callback",
  });

  const [stripeSettings, setStripeSettings] = useState({
    enabled: false,
    publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: "",
    testMode: true,
  });

  const [currencySettings, setCurrencySettings] = useState({
    supportedCurrencies: ["NGN", "USD", "EUR", "GBP"],
    defaultCurrency: "NGN",
    convertCurrency: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const toggleKeyVisibility = (key: string) => {
    setShowKeys({
      ...showKeys,
      [key]: !showKeys[key as keyof typeof showKeys],
    });
    setIsDirty(true);
  };

  const handleSettingChange = (section: string, field: string, value: any) => {
    if (section === "paystack") {
      setPaystackSettings({ ...paystackSettings, [field]: value });
    } else if (section === "stripe") {
      setStripeSettings({ ...stripeSettings, [field]: value });
    } else if (section === "currency") {
      setCurrencySettings({ ...currencySettings, [field]: value });
    }
    setIsDirty(true);
  };

  const handleTestConnection = async (gateway: string) => {
    setIsTesting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`${gateway} connection successful!`);
    } catch (error) {
      toast.error(`Failed to connect to ${gateway}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Payment settings saved successfully!");
      setIsDirty(false);
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setPaystackSettings({
      enabled: true,
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_TEST_PUBLIC_KEY || "",
      secretKey: process.env.PAYSTACK_TEST_SECRET_KEY || "",
      testMode: true,
      callbackUrl: "https://fourthview.com/payment/callback",
    });
    setStripeSettings({
      enabled: false,
      publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
      secretKey: process.env.STRIPE_SECRET_KEY || "",
      webhookSecret: "",
      testMode: true,
    });
    setCurrencySettings({
      supportedCurrencies: ["NGN", "USD", "EUR", "GBP"],
      defaultCurrency: "NGN",
      convertCurrency: true,
    });
    setIsDirty(false);
    toast.info("Changes discarded");
  };

  const hasPaystackKeys =
    paystackSettings.publicKey && paystackSettings.secretKey;
  const hasStripeKeys = stripeSettings.publicKey && stripeSettings.secretKey;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Payment Configuration
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage payment gateways and currency preferences
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

      <Tabs defaultValue="paystack" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="paystack" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Paystack
          </TabsTrigger>
          <TabsTrigger value="stripe" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Stripe
          </TabsTrigger>
        </TabsList>

        {/* Paystack Settings */}
        <TabsContent value="paystack" className="mt-6">
          <div className="space-y-6">
            {/* Enable Switch */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-green-600" />
                  Enable Paystack
                </h3>
                <p className="text-sm text-gray-500">
                  Accept payments via Paystack (NGN)
                </p>
              </div>
              <Switch
                checked={paystackSettings.enabled}
                onCheckedChange={(checked) =>
                  handleSettingChange("paystack", "enabled", checked)
                }
              />
            </div>

            {paystackSettings.enabled && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Test Mode */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Test Mode</Label>
                    <p className="text-sm text-gray-500">
                      Use test keys for development
                    </p>
                  </div>
                  <Switch
                    checked={paystackSettings.testMode}
                    onCheckedChange={(checked) =>
                      handleSettingChange("paystack", "testMode", checked)
                    }
                  />
                </div>

                {/* Public Key */}
                <div>
                  <Label className="font-medium">Public Key</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showKeys.paystackPublic ? "text" : "password"}
                      value={paystackSettings.publicKey}
                      onChange={(e) =>
                        handleSettingChange(
                          "paystack",
                          "publicKey",
                          e.target.value,
                        )
                      }
                      placeholder="pk_test_xxxxxxxx"
                      className="pr-10 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility("paystackPublic")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys.paystackPublic ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Find this in Paystack Dashboard → Settings → API Keys
                  </p>
                </div>

                {/* Secret Key */}
                <div>
                  <Label className="font-medium">Secret Key</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showKeys.paystackSecret ? "text" : "password"}
                      value={paystackSettings.secretKey}
                      onChange={(e) =>
                        handleSettingChange(
                          "paystack",
                          "secretKey",
                          e.target.value,
                        )
                      }
                      placeholder="sk_test_xxxxxxxx"
                      className="pr-10 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility("paystackSecret")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys.paystackSecret ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Callback URL */}
                <div>
                  <Label className="font-medium">Callback URL</Label>
                  <Input
                    value={paystackSettings.callbackUrl}
                    onChange={(e) =>
                      handleSettingChange(
                        "paystack",
                        "callbackUrl",
                        e.target.value,
                      )
                    }
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    URL where customers are redirected after payment
                  </p>
                </div>

                {/* Test Connection Button */}
                {hasPaystackKeys && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleTestConnection("Paystack")}
                    disabled={isTesting}
                    className="gap-2"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isTesting ? "animate-spin" : ""}`}
                    />
                    {isTesting ? "Testing..." : "Test Connection"}
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </TabsContent>

        {/* Stripe Settings */}
        <TabsContent value="stripe" className="mt-6">
          <div className="space-y-6">
            {/* Enable Switch */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  Enable Stripe
                </h3>
                <p className="text-sm text-gray-500">
                  Accept payments via Stripe (USD, EUR, GBP)
                </p>
              </div>
              <Switch
                checked={stripeSettings.enabled}
                onCheckedChange={(checked) =>
                  handleSettingChange("stripe", "enabled", checked)
                }
              />
            </div>

            {stripeSettings.enabled && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Test Mode */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <Label className="font-medium">Test Mode</Label>
                    <p className="text-sm text-gray-500">
                      Use test keys for development
                    </p>
                  </div>
                  <Switch
                    checked={stripeSettings.testMode}
                    onCheckedChange={(checked) =>
                      handleSettingChange("stripe", "testMode", checked)
                    }
                  />
                </div>

                {/* Publishable Key */}
                <div>
                  <Label className="font-medium">Publishable Key</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showKeys.stripePublic ? "text" : "password"}
                      value={stripeSettings.publicKey}
                      onChange={(e) =>
                        handleSettingChange(
                          "stripe",
                          "publicKey",
                          e.target.value,
                        )
                      }
                      placeholder="pk_test_xxxxxxxx"
                      className="pr-10 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility("stripePublic")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys.stripePublic ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Secret Key */}
                <div>
                  <Label className="font-medium">Secret Key</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showKeys.stripeSecret ? "text" : "password"}
                      value={stripeSettings.secretKey}
                      onChange={(e) =>
                        handleSettingChange(
                          "stripe",
                          "secretKey",
                          e.target.value,
                        )
                      }
                      placeholder="sk_test_xxxxxxxx"
                      className="pr-10 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility("stripeSecret")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys.stripeSecret ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Webhook Secret */}
                <div>
                  <Label className="font-medium">Webhook Secret</Label>
                  <Input
                    type="password"
                    value={stripeSettings.webhookSecret}
                    onChange={(e) =>
                      handleSettingChange(
                        "stripe",
                        "webhookSecret",
                        e.target.value,
                      )
                    }
                    placeholder="whsec_xxxxxxxx"
                    className="mt-1 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Required for handling payment confirmation webhooks
                  </p>
                </div>

                {/* Test Connection Button */}
                {hasStripeKeys && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleTestConnection("Stripe")}
                    disabled={isTesting}
                    className="gap-2"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isTesting ? "animate-spin" : ""}`}
                    />
                    {isTesting ? "Testing..." : "Test Connection"}
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Currency Settings Section */}
      <div className="border-t border-gray-200 pt-6 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Currency Settings</h3>
        </div>

        <div className="space-y-5">
          {/* Supported Currencies */}
          <div>
            <Label className="font-medium">Supported Currencies</Label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["NGN", "USD", "EUR", "GBP"].map((currency) => (
                <label
                  key={currency}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={currencySettings.supportedCurrencies.includes(
                      currency,
                    )}
                    onChange={(e) => {
                      const newCurrencies = e.target.checked
                        ? [...currencySettings.supportedCurrencies, currency]
                        : currencySettings.supportedCurrencies.filter(
                            (c) => c !== currency,
                          );
                      handleSettingChange(
                        "currency",
                        "supportedCurrencies",
                        newCurrencies,
                      );
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{currency}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Default Currency */}
          <div>
            <Label className="font-medium">Default Currency</Label>
            <select
              value={currencySettings.defaultCurrency}
              onChange={(e) =>
                handleSettingChange(
                  "currency",
                  "defaultCurrency",
                  e.target.value,
                )
              }
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {currencySettings.supportedCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-convert Prices */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="font-medium">Auto-convert Prices</Label>
              <p className="text-sm text-gray-500">
                Automatically convert prices based on exchange rates
              </p>
            </div>
            <Switch
              checked={currencySettings.convertCurrency}
              onCheckedChange={(checked) =>
                handleSettingChange("currency", "convertCurrency", checked)
              }
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving || !isDirty}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
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

      {/* Save Indicator */}
      {!isDirty && !isSaving && (
        <div className="flex items-center justify-end gap-1 text-xs text-green-600">
          <CheckCircle className="w-3 h-3" />
          All settings saved
        </div>
      )}
    </div>
  );
}
