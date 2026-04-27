// app/admin/settings/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  CreditCard,
  Truck,
  Mail,
  Bell,
  Shield,
  Building2,
  Search,
} from "lucide-react";
import GeneralSettings from "@/components/Admin/Settings/GeneralSettings";
import ExchangeRateSettings from "@/components/Admin/Settings/ExchangeRateSettings";
import PaymentSettings from "@/components/Admin/Settings/PaymentSettings";
import ShippingSettings from "@/components/Admin/Settings/ShippingSettings";
import EmailSettings from "@/components/Admin/Settings/EmailSettings";
import NotificationSettings from "@/components/Admin/Settings/NotificationSettings";
import SecuritySettings from "@/components/Admin/Settings/SecuritySettings";

const settingsTabs = [
  { id: "general", label: "General", icon: Building2 },
  { id: "exchange-rate", label: "Exchange Rate", icon: RefreshCw },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "email", label: "Email", icon: Mail },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTabs = settingsTabs.filter((tab) =>
    tab.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-500 mt-1">
                Manage your store configuration and preferences
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 w-64 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <div className="flex px-4 sm:px-6">
              {filteredTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group flex items-center gap-2 px-4 py-3 text-sm font-medium
                      transition-all duration-200 border-b-2 relative
                      ${
                        isActive
                          ? "text-blue-600 border-blue-600"
                          : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"}`}
                    />
                    <span className="hidden sm:inline whitespace-nowrap">
                      {tab.label}
                    </span>
                    {tab.id === "exchange-rate" && (
                      <span className="ml-1.5 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                        Live
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "general" && <GeneralSettings />}
                {activeTab === "exchange-rate" && <ExchangeRateSettings />}
                {activeTab === "payment" && <PaymentSettings />}
                {activeTab === "shipping" && <ShippingSettings />}
                {activeTab === "email" && <EmailSettings />}
                {activeTab === "notifications" && <NotificationSettings />}
                {activeTab === "security" && <SecuritySettings />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
