import { authOptions } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userRole !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { count: totalCustomers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  const { data: orders } = await supabase
    .from("orders")
    .select("total, created_at, items")
    .eq("status", "paid");

  const totalSales =
    orders?.reduce((acc, o) => acc + (Number(o.total) || 0), 0) ?? 0;

  // Month boundaries
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const thisMonthOrders =
    orders?.filter((o) => new Date(o.created_at) >= thisMonthStart) ?? [];
  const lastMonthOrders =
    orders?.filter((o) => {
      const d = new Date(o.created_at);
      return d >= lastMonthStart && d < thisMonthStart;
    }) ?? [];

  const thisMonthSales = thisMonthOrders.reduce(
    (acc, o) => acc + Number(o.total),
    0,
  );
  const lastMonthSales = lastMonthOrders.reduce(
    (acc, o) => acc + Number(o.total),
    0,
  );

  const salesTrend =
    lastMonthSales === 0
      ? null
      : Math.round(((thisMonthSales - lastMonthSales) / lastMonthSales) * 100);
  const ordersTrend =
    lastMonthOrders.length === 0
      ? null
      : Math.round(
          ((thisMonthOrders.length - lastMonthOrders.length) /
            lastMonthOrders.length) *
            100,
        );

  // Customers this month vs last month
  const { data: allUsers } = await supabase.from("users").select("created_at");
  const thisMonthCustomers =
    allUsers?.filter((u) => new Date(u.created_at) >= thisMonthStart).length ??
    0;
  const lastMonthCustomers =
    allUsers?.filter((u) => {
      const d = new Date(u.created_at);
      return d >= lastMonthStart && d < thisMonthStart;
    }).length ?? 0;
  const customersTrend =
    lastMonthCustomers === 0
      ? null
      : Math.round(
          ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) *
            100,
        );

  // Monthly chart data
  const currentYear = now.getFullYear();
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(currentYear, i).toLocaleString("default", {
      month: "long",
    }),
    value: 0,
  }));

  orders?.forEach((order) => {
    const date = new Date(order.created_at);
    if (date.getFullYear() === currentYear) {
      monthlyData[date.getMonth()].value += Number(order.total) || 0;
    }
  });

  // Order ranking
  const productMap: Record<string, number> = {};
  orders?.forEach((order) => {
    if (Array.isArray(order.items)) {
      order.items.forEach((item: { itemName: string; quantity?: number }) => {
        productMap[item.itemName] =
          (productMap[item.itemName] || 0) + (item.quantity || 1);
      });
    }
  });

  const orderRanking = Object.entries(productMap)
    .map(([product, total]) => ({ product, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 7);

  return NextResponse.json({
    totalSales,
    totalOrders: orders?.length ?? 0,
    totalCustomers: totalCustomers ?? 0,
    salesTrend,
    ordersTrend,
    customersTrend,
    monthlyData,
    orderRanking,
  });
}
