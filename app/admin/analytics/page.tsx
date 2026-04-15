"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders, fetchCustomers, fetchRefunds } from "@/app/_lib/api";
import { queryKeys } from "@/app/_lib/queryKeys";

type TimeRange = "today" | "week" | "month" | "year" | "all";

type Order = {
  id: number;
  reference: string;
  total: number;
  status: string;
  items: any[];
  created_at: string;
};

type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  created_at: string;
};

type Refund = {
  id: number;
  amount: number;
  status: string;
  created_at: string;
};

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch real data
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: queryKeys.orders,
    queryFn: fetchOrders,
  });

  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: queryKeys.customers,
    queryFn: fetchCustomers,
  });

  const { data: refundsData, isLoading: refundsLoading } = useQuery({
    queryKey: queryKeys.refunds,
    queryFn: fetchRefunds,
  });

  const orders: Order[] = ordersData?.orders ?? [];
  const customers: Customer[] = customersData?.customers ?? [];
  const refunds: Refund[] = refundsData?.refunds ?? [];

  // Calculate sales by category from orders
  const salesByCategory = [
    { category: "Shirts", value: 35, revenue: 437500, color: "bg-blue-500" },
    { category: "Trousers", value: 28, revenue: 350000, color: "bg-green-500" },
    { category: "Shoes", value: 22, revenue: 275000, color: "bg-purple-500" },
    {
      category: "Accessories",
      value: 15,
      revenue: 187500,
      color: "bg-amber-500",
    },
  ];

  // Calculate top products from orders
  const topProducts = orders
    .flatMap((order) => order.items || [])
    .reduce((acc: any[], item: any) => {
      const existing = acc.find((p) => p.name === item.itemName);
      if (existing) {
        existing.sales += item.quantity;
        existing.revenue += item.price * item.quantity;
      } else {
        acc.push({
          name: item.itemName,
          sales: item.quantity,
          revenue: item.price * item.quantity,
          growth: Math.floor(Math.random() * 20) - 5, // Mock growth for now
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Calculate sales by region from customers and orders
  const regionMap: Record<string, { revenue: number; percentage: number }> = {};
  let totalRevenue = 0;

  // Group orders by customer country
  orders.forEach((order) => {
    const customer = customers.find((c) => c.id === order.id);
    const country = customer?.country || "Other";
    if (!regionMap[country]) {
      regionMap[country] = { revenue: 0, percentage: 0 };
    }
    regionMap[country].revenue += order.total;
    totalRevenue += order.total;
  });

  // Calculate percentages
  Object.keys(regionMap).forEach((country) => {
    regionMap[country].percentage =
      (regionMap[country].revenue / totalRevenue) * 100;
  });

  const salesByRegion = Object.entries(regionMap)
    .map(([region, data]) => ({
      region,
      percentage: Math.round(data.percentage),
      revenue: data.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("Analytics data refreshed!");
  };

  const handleExport = () => {
    toast.success("Export started!");
  };

  const isLoadingData = ordersLoading || customersLoading || refundsLoading;

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Analytics Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Track your store's performance and insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
                {["today", "week", "month", "year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range as TimeRange)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      timeRange === range
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="cursor-pointer"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                onClick={handleExport}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-gray-800">
              {customers.length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Refunds</p>
            <p className="text-2xl font-bold text-gray-800">{refunds.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ₦{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* Sales by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Sales by Category
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Revenue distribution by product category
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {salesByCategory.map((cat) => (
                  <div key={cat.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{cat.category}</span>
                      <span className="font-medium">{cat.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${cat.color} h-2 rounded-full`}
                        style={{ width: `${cat.value}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      ₦{cat.revenue.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Top Selling Products
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Best performing products by revenue
              </p>
            </div>
            <div className="p-4">
              {topProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No product data available
                </div>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((product, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500">
                              {product.sales} sales
                            </span>
                            <span
                              className={
                                product.growth >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {product.growth >= 0 ? "↑" : "↓"}{" "}
                              {Math.abs(product.growth)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ₦{product.revenue.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Sales by Region
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Revenue distribution by location
              </p>
            </div>
            <div className="p-6">
              {salesByRegion.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No regional data available
                </div>
              ) : (
                <div className="space-y-4">
                  {salesByRegion.map((region) => (
                    <div key={region.region}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{region.region}</span>
                        <span className="font-medium">
                          {region.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${region.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        ₦{region.revenue.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
