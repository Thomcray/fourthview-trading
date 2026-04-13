// app/admin/product-services/page.tsx
"use client";

import AddProduct from "@/components/Admin/AddProduct/AddProduct";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, DollarSign, PlusCircle, List, Settings } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProductServicesPage() {
  const [activeTab, setActiveTab] = useState("shop");

  const tabs = [
    {
      id: "shop",
      label: "Shop With Us",
      icon: Package,
      description: "Add and manage products",
    },
    {
      id: "currency",
      label: "Currency Exchange",
      icon: DollarSign,
      description: "Manage exchange rates",
    },
    {
      id: "categories",
      label: "Categories",
      icon: List,
      description: "Manage product categories",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Configure product settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Products & Services
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your products, categories, and service offerings
          </p>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Tabs
            defaultValue="shop"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Tab List */}
            <div className="border-b border-gray-200 bg-gray-50/50 px-4 pt-2">
              <TabsList className="flex flex-wrap gap-1 bg-transparent h-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-lg
                        transition-all duration-200 data-[state=active]:bg-white
                        data-[state=active]:text-blue-700 data-[state=active]:shadow-sm
                        text-gray-600 hover:text-gray-900
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Currency Exchange Tab */}
            <TabsContent value="currency" className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Currency Exchange Management
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    This feature is coming soon. You&apos;ll be able to manage
                    exchange rates and currency pairs.
                  </p>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Learn more →
                  </button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Shop With Us Tab */}
            <TabsContent value="shop" className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Manage Products
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Add, edit, or remove products from your store
                      </p>
                    </div>
                  </div>
                </div>
                <AddProduct />
              </motion.div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <List className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Category Management
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Organize your products with categories and subcategories.
                  </p>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Manage Categories →
                  </button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Product Settings
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Configure product display, inventory settings, and more.
                  </p>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Configure Settings →
                  </button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-xs text-gray-400 mt-1">+0 this month</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Active Categories</p>
            <p className="text-2xl font-bold text-gray-800">0</p>
            <p className="text-xs text-gray-400 mt-1">Across all collections</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Low Stock Items</p>
            <p className="text-2xl font-bold text-orange-600">0</p>
            <p className="text-xs text-gray-400 mt-1">Need attention</p>
          </div>
        </div>
      </div>
    </div>
  );
}
