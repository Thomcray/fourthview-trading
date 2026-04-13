// app/admin/dashboard/page.tsx
"use client";

import OrderRanking from "@/components/Admin/OrderRanking/OrderRanking";
import OrderRankingList from "@/components/Admin/OrderRanking/OrderRankingList";
import DashboardCards from "@/components/Admin/Cards/DashboardCards";
import { TransactionChart } from "@/components/TransactionChart";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/app/_lib/api";
import { queryKeys } from "@/app/_lib/queryKeys";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardData = {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  salesTrend: number | null;
  ordersTrend: number | null;
  customersTrend: number | null;
  monthlyData: { month: string; value: number }[];
  orderRanking: { product: string; total: number }[];
};

export default function AdminDashboard() {
  const { data, isLoading, isError, refetch, isFetching } =
    useQuery<DashboardData>({
      queryKey: queryKeys.dashboard,
      queryFn: fetchDashboard,
    });

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-96 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-64 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-100 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to Load Dashboard
          </h2>
          <p className="text-gray-500 mb-6">
            There was an error loading the dashboard data. Please try again.
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
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
                Admin Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Welcome back! Here's what's happening with your store today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-400">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="cursor-pointer"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DashboardCards
            totalSales={data.totalSales}
            totalOrders={data.totalOrders}
            totalCustomers={data.totalCustomers}
            salesTrend={data.salesTrend}
            ordersTrend={data.ordersTrend}
            customersTrend={data.customersTrend}
          />
        </motion.div>

        {/* Charts and Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8"
        >
          {/* Transaction Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Monthly Transaction Trend
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Revenue overview for the current year
              </p>
            </div>
            <div className="p-6">
              <TransactionChart data={data.monthlyData} />
            </div>
          </div>

          {/* Order Ranking */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Top Selling Products
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Based on order volume
              </p>
            </div>
            <div className="p-4">
              <OrderRanking>
                <OrderRankingList items={data.orderRanking} />
              </OrderRanking>
            </div>
          </div>
        </motion.div>

        {/* Optional: Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <QuickActionCard
            title="Manage Products"
            description="Add, edit, or remove products"
            icon="🛍️"
            href="/admin/products"
          />
          <QuickActionCard
            title="View Orders"
            description="Process and track orders"
            icon="📦"
            href="/admin/orders"
          />
          <QuickActionCard
            title="Manage Users"
            description="View and manage customers"
            icon="👥"
            href="/admin/users"
          />
          <QuickActionCard
            title="Settings"
            description="Configure store settings"
            icon="⚙️"
            href="/admin/settings"
          />
        </motion.div>
      </div>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
}) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

import { useRouter } from "next/navigation";
