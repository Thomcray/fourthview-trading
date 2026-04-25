import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userRole !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient(true);

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }

  // Get unique userIds
  const userIds = [...new Set(orders.map((o) => o.userId).filter(Boolean))];

  // Fetch users separately
  const { data: users } = await supabase
    .from("users")
    .select("id, email, firstName, lastName")
    .in("id", userIds);

  const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));

  const mappedOrders = orders.map((order) => {
    const user = userMap[order.userId];
    return {
      ...order,
      customerName: user
        ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
        : "Unknown",
      customerEmail: user?.email ?? "Unknown",
    };
  });

  return NextResponse.json({ orders: mappedOrders });
}
