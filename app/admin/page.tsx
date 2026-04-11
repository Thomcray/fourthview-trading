"use client";

import OrderRanking from "@/components/Admin/OrderRanking/OrderRanking";
import OrderRankingList from "@/components/Admin/OrderRanking/OrderRankingList";
import DashboardCards from "@/components/Admin/Cards/DashboardCards";
import { TransactionChart } from "@/components/TransactionChart";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/app/_lib/api";
import { queryKeys } from "@/app/_lib/queryKeys";

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
  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: queryKeys.dashboard,
    queryFn: fetchDashboard,
  });

  if (isLoading)
    return (
      <p className="text-slate-500 text-sm text-center py-20">
        Loading dashboard...
      </p>
    );

  if (isError || !data)
    return (
      <p className="text-slate-500 text-sm text-center py-20">
        Failed to load dashboard.
      </p>
    );

  return (
    <div className="w-full space-y-10">
      <DashboardCards
        totalSales={data.totalSales}
        totalOrders={data.totalOrders}
        totalCustomers={data.totalCustomers}
        salesTrend={data.salesTrend}
        ordersTrend={data.ordersTrend}
        customersTrend={data.customersTrend}
      />

      <div className="w-full flex flex-row max-sm:flex-col gap-3">
        <div className="flex-1 px-4 py-4 border rounded-md">
          <h1 className="text-base text-slate-500 mb-4">
            Monthly Transaction Trend
          </h1>
          <TransactionChart data={data.monthlyData} />
        </div>

        <OrderRanking>
          <OrderRankingList items={data.orderRanking} />
        </OrderRanking>
      </div>
    </div>
  );
}
