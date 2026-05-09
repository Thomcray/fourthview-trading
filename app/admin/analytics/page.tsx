"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders, fetchCustomers, fetchRefunds } from "@/app/_lib/api";
import { queryKeys } from "@/app/_lib/queryKeys";
import { useCurrency } from "@/components/CurrencyContext";

type TimeRange = "today" | "week" | "month" | "year" | "all";

type OrderItem = {
  itemName: string;
  quantity: number;
  price: number;
  category?: string;
};

type Order = {
  id: number;
  reference: string;
  total: number;
  status: string;
  items: OrderItem[];
  created_at: string;
  userId: string;
  order_status: string;
  shipping_address: {
    city: string;
    country: string;
    zipCode: string;
    apartment: string;
    streetAddress: string;
  } | null;
  customerName: string;
  customerEmail: string;
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

type TopProduct = {
  name: string;
  sales: number;
  revenue: number;
};

const CATEGORY_COLORS: Record<string, string> = {
  Shirts: "bg-blue-500",
  Trousers: "bg-green-500",
  Shoes: "bg-purple-500",
  Furniture: "bg-orange-500",
  Accessories: "bg-amber-500",
  Other: "bg-gray-400",
};

function filterByTimeRange(items: { created_at: string }[], range: TimeRange) {
  if (range === "all") return items;
  const now = new Date();
  const cutoff = new Date();
  if (range === "today") cutoff.setHours(0, 0, 0, 0);
  else if (range === "week") cutoff.setDate(now.getDate() - 7);
  else if (range === "month") cutoff.setMonth(now.getMonth() - 1);
  else if (range === "year") cutoff.setFullYear(now.getFullYear() - 1);
  return items.filter((i) => new Date(i.created_at) >= cutoff);
}

function inferCategory(itemName: string): string {
  const name = itemName.toLowerCase();
  if (
    name.includes("shirt") ||
    name.includes("t-shirt") ||
    name.includes("top")
  )
    return "Shirts";
  if (
    name.includes("trouser") ||
    name.includes("pant") ||
    name.includes("jean")
  )
    return "Trousers";
  if (
    name.includes("shoe") ||
    name.includes("sneaker") ||
    name.includes("air force") ||
    name.includes("boot")
  )
    return "Shoes";
  if (
    name.includes("sofa") ||
    name.includes("furniture") ||
    name.includes("chair") ||
    name.includes("table")
  )
    return "Furniture";
  if (
    name.includes("bag") ||
    name.includes("watch") ||
    name.includes("belt") ||
    name.includes("cap")
  )
    return "Accessories";
  return "Other";
}
export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { formatPrice, formatFromNGN } = useCurrency();

  const {
    data: ordersData,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: queryKeys.orders,
    queryFn: fetchOrders,
  });

  const {
    data: customersData,
    isLoading: customersLoading,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: queryKeys.customers,
    queryFn: fetchCustomers,
  });

  const {
    data: refundsData,
    isLoading: refundsLoading,
    refetch: refetchRefunds,
  } = useQuery({
    queryKey: queryKeys.refunds,
    queryFn: fetchRefunds,
  });

  const allOrders: Order[] = ordersData?.orders ?? [];
  const allCustomers: Customer[] = customersData?.customers ?? [];
  const allRefunds: Refund[] = refundsData?.refunds ?? [];

  // Apply time range filter
  const orders = filterByTimeRange(allOrders, timeRange) as Order[];
  const customers = filterByTimeRange(allCustomers, timeRange) as Customer[];
  const refunds = filterByTimeRange(allRefunds, timeRange) as Refund[];

  // Sales by category — derived from real order items
  const categoryMap: Record<string, { revenue: number }> = {};
  let totalCategoryRevenue = 0;

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const cat = inferCategory(item.itemName);
      if (!categoryMap[cat]) categoryMap[cat] = { revenue: 0 };
      categoryMap[cat].revenue += item.price * item.quantity;
      totalCategoryRevenue += item.price * item.quantity;
    });
  });

  const salesByCategory = Object.entries(categoryMap)
    .map(([category, data]) => ({
      category,
      revenue: data.revenue,
      value:
        totalCategoryRevenue > 0
          ? Math.round((data.revenue / totalCategoryRevenue) * 100)
          : 0,
      color: CATEGORY_COLORS[category] ?? "bg-gray-400",
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // Top products — derived from real order items, no mock growth
  const topProducts: TopProduct[] = orders
    .flatMap((order) => order.items || [])
    .reduce<TopProduct[]>((acc, item) => {
      const existing = acc.find((p) => p.name === item.itemName);
      if (existing) {
        existing.sales += item.quantity;
        existing.revenue += item.price * item.quantity;
      } else {
        acc.push({
          name: item.itemName,
          sales: item.quantity,
          revenue: item.price * item.quantity,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Sales by region
  const regionMap: Record<string, { revenue: number }> = {};
  let totalRevenue = 0;

  orders.forEach((order) => {
    const country = order.shipping_address?.country || "Other";
    if (!regionMap[country]) regionMap[country] = { revenue: 0 };
    regionMap[country].revenue += order.total;
    totalRevenue += order.total;
  });

  const salesByRegion = Object.entries(regionMap)
    .map(([region, data]) => ({
      region,
      revenue: data.revenue,
      percentage:
        totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchOrders(), refetchCustomers(), refetchRefunds()]);
    setIsRefreshing(false);
    toast.success("Analytics data refreshed!");
  };

  const handleExport = () => {
    const csv = [
      ["Metric", "Value"],
      ["Total Orders", orders.length],
      ["Total Customers", customers.length],
      ["Total Refunds", refunds.length],
      ["Total Revenue (NGN)", orders.reduce((sum, o) => sum + o.total, 0)],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export downloaded!");
  };

  const isLoadingData = ordersLoading || customersLoading || refundsLoading;

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-linear-60-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
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
                Track your store&apos;s performance and insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
                {(["today", "week", "month", "year", "all"] as TimeRange[]).map(
                  (range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer ${
                        timeRange === range
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ),
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="cursor-pointer"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
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
              {formatFromNGN(orders.reduce((sum, o) => sum + o.total, 0)) ??
                `₦${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}`}
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
              {salesByCategory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No category data available
                </div>
              ) : (
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
                        {formatPrice(cat.revenue) ??
                          `¥${cat.revenue.toLocaleString()}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
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
                          <p className="text-xs text-gray-500">
                            {product.sales} sales
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {formatPrice(product.revenue) ??
                          `¥${product.revenue.toLocaleString()}`}
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
                        {formatFromNGN(region.revenue) ??
                          `₦${region.revenue.toLocaleString()}`}
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
