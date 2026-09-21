"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalytics } from "@/app/_lib/api";
import { useCurrency } from "@/components/CurrencyContext";

type TimeRange = "today" | "week" | "month" | "year" | "all";

type AnalyticsStats = {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalRefunds: number;
};

type SalesByCategory = {
  category: string;
  revenue: number;
  value: number;
};

type TopProduct = {
  name: string;
  sales: number;
  revenue: number;
};

type SalesByRegion = {
  region: string;
  revenue: number;
  percentage: number;
};

type AnalyticsData = {
  stats: AnalyticsStats;
  salesByCategory: SalesByCategory[];
  topProducts: TopProduct[];
  salesByRegion: SalesByRegion[];
};

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { formatPrice, formatFromNGN } = useCurrency();

  const { data, isLoading, isFetching, refetch } = useQuery<AnalyticsData>({
    queryKey: ["analytics", timeRange],

    queryFn: () => fetchAnalytics(timeRange),

    placeholderData: (previousData) => previousData,
  });

  const stats = data?.stats ?? {
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalRefunds: 0,
  };

  const salesByCategory = data?.salesByCategory ?? [];

  const topProducts = data?.topProducts ?? [];

  const salesByRegion = data?.salesByRegion ?? [];

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);

      await refetch();

      toast.success("Analytics data refreshed!");
    } catch (error) {
      console.error("Analytics refresh error:", error);

      toast.error("Failed to refresh analytics data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    const rows = [
      ["Metric", "Value"],

      ["Total Orders", stats.totalOrders],

      ["Total Customers", stats.totalCustomers],

      ["Total Refunds", stats.totalRefunds],

      ["Total Revenue (NGN)", stats.totalRevenue],
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `analytics-${timeRange}-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    a.click();

    URL.revokeObjectURL(url);

    toast.success("Export downloaded!");
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-linear-60-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div key={index} className="h-28 bg-gray-200 rounded-xl" />
              ))}
            </div>

            <div className="h-64 bg-gray-200 rounded-xl" />

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
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
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

            <div className="flex items-center gap-3 flex-wrap">
              {/* Time range */}
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

              {/* Refresh */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing || isFetching}
                className="cursor-pointer"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    isRefreshing || isFetching ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>

              {/* Export */}
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
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {/* Orders */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>

            <p className="text-2xl font-bold text-gray-800">
              {stats.totalOrders.toLocaleString()}
            </p>
          </div>

          {/* Customers */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Customers</p>

            <p className="text-2xl font-bold text-gray-800">
              {stats.totalCustomers.toLocaleString()}
            </p>
          </div>

          {/* Refunds */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Refunds</p>

            <p className="text-2xl font-bold text-gray-800">
              {stats.totalRefunds.toLocaleString()}
            </p>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Revenue</p>

            <p className="text-2xl font-bold text-green-600">
              {formatFromNGN(stats.totalRevenue) ??
                `₦${stats.totalRevenue.toLocaleString()}`}
            </p>
          </div>
        </motion.div>

        {/* Sales by Category */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
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
                  {salesByCategory.map((category) => (
                    <div key={category.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{category.category}</span>

                        <span className="font-medium">{category.value}%</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${
                            category.category === "Shirts"
                              ? "bg-blue-500"
                              : category.category === "Trousers"
                                ? "bg-green-500"
                                : category.category === "Shoes"
                                  ? "bg-purple-500"
                                  : category.category === "Furniture"
                                    ? "bg-orange-500"
                                    : category.category === "Accessories"
                                      ? "bg-amber-500"
                                      : "bg-gray-400"
                          } h-2 rounded-full`}
                          style={{
                            width: `${category.value}%`,
                          }}
                        />
                      </div>

                      <p className="text-xs text-gray-400 mt-1">
                        {formatPrice(category.revenue) ??
                          `₦${category.revenue.toLocaleString()}`}
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
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
          }}
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
                  {topProducts.map((product, index) => (
                    <div
                      key={`${product.name}-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                          {index + 1}
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {product.sales.toLocaleString()} sales
                          </p>
                        </div>
                      </div>

                      <p className="font-semibold text-gray-800">
                        {formatPrice(product.revenue) ??
                          `₦${product.revenue.toLocaleString()}`}
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
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
          }}
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
                          style={{
                            width: `${region.percentage}%`,
                          }}
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
