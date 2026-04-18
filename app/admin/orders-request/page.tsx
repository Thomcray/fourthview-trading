"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingBag,
  ClipboardList,
  RefreshCw,
  PackageSearch,
} from "lucide-react";
import { useState } from "react";
import OrdersTab from "@/components/Admin/Tabs/OrdersTab";
import RequestsTab from "@/components/Admin/Tabs/RequestsTab";
import SpecialOrdersTab from "@/components/Admin/Tabs/SpecialOrdersTab";
import RefundsTab from "@/components/Admin/Tabs/RefundsTab";

type Tab = "orders" | "requests" | "special" | "refunds";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Orders & Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer orders, service requests, special orders, and
            refunds
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)}>
          <TabsList className="grid w-full max-w-xl grid-cols-4">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="special" className="flex items-center gap-2">
              <PackageSearch className="w-4 h-4" />
              Special
            </TabsTrigger>
            <TabsTrigger value="refunds" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refunds
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

          <TabsContent value="refunds" className="mt-6">
            <RefundsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
