"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingBag,
  ClipboardList,
  RefreshCw,
  PackageSearch,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import OrdersTab from "@/components/Admin/Tabs/OrdersTab";
import RequestsTab from "@/components/Admin/Tabs/RequestsTab";
import SpecialOrdersTab from "@/components/Admin/Tabs/SpecialOrdersTab";
import RefundsTab from "@/components/Admin/Tabs/RefundsTab";
import StudyTab from "@/components/Admin/Tabs/StudyTab";

type Tab = "orders" | "requests" | "special" | "study" | "refunds";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Orders & Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer orders, service requests, special orders, study in
            China applications, and refunds
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)}>
          <TabsList className="flex flex-wrap h-auto w-full gap-1 bg-gray-100 p-1">
            <TabsTrigger
              value="orders"
              className="flex items-center gap-1.5 cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 py-2 text-xs sm:text-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Orders</span>
              <span className="sm:hidden">Orders</span>
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="flex items-center gap-1.5 cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 py-2 text-xs sm:text-sm"
            >
              <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Requests</span>
              <span className="sm:hidden">Requests</span>
            </TabsTrigger>
            <TabsTrigger
              value="special"
              className="flex items-center gap-1.5 cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 py-2 text-xs sm:text-sm"
            >
              <PackageSearch className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Special</span>
              <span className="sm:hidden">Special</span>
            </TabsTrigger>
            <TabsTrigger
              value="study"
              className="flex items-center gap-1.5 cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 py-2 text-xs sm:text-sm"
            >
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Study</span>
              <span className="sm:hidden">Study</span>
            </TabsTrigger>
            <TabsTrigger
              value="refunds"
              className="flex items-center gap-1.5 cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 py-2 text-xs sm:text-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Refunds</span>
              <span className="sm:hidden">Refunds</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <RequestsTab />
          </TabsContent>

          <TabsContent value="special" className="mt-6">
            <SpecialOrdersTab />
          </TabsContent>

          <TabsContent value="study" className="mt-6">
            <StudyTab />
          </TabsContent>

          <TabsContent value="refunds" className="mt-6">
            <RefundsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
