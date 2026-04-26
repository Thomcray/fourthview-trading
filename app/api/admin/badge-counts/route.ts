import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient(true);

    // Fetch counts in parallel
    const [
      { count: ordersCount, error: ordersError },
      { count: ticketsCount, error: ticketsError },
      { count: customersCount, error: customersError },
    ] = await Promise.all([
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("order_status", "processing"),
      supabase
        .from("support_tickets")
        .select("*", { count: "exact", head: true })
        .eq("status", "open"),
      supabase.from("users").select("*", { count: "exact", head: true }),
    ]);

    if (ordersError) console.error("Orders count error:", ordersError);
    if (ticketsError) console.error("Tickets count error:", ticketsError);
    if (customersError) console.error("Customers count error:", customersError);

    return NextResponse.json({
      orders: ordersCount || 0,
      tickets: ticketsCount || 0,
      customers: customersCount || 0,
    });
  } catch (error) {
    console.error("Badge counts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch counts" },
      { status: 500 },
    );
  }
}
