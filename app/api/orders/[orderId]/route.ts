import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";

// Define item type
type OrderItem = {
  id?: number;
  itemName?: string;
  name?: string;
  product_name?: string;
  quantity?: number;
  price?: string | number;
  size?: string;
  image?: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient(true);
    const { orderId } = await params;

    // Fetch order
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Fetch user data
    let userData = null;
    if (order.userId) {
      const { data: user } = await supabase
        .from("users")
        .select("id, email, firstName, lastName")
        .eq("id", order.userId)
        .maybeSingle();

      userData = user;
    }

    // Parse items from JSONB
    let parsedItems: OrderItem[] = [];
    if (order.items) {
      try {
        parsedItems =
          typeof order.items === "string"
            ? JSON.parse(order.items)
            : order.items;
      } catch {
        parsedItems = [];
      }
    }

    // Format the order
    const formattedOrder = {
      id: order.id,
      reference: order.reference || `ORD-${order.id}`,
      created_at: order.created_at || new Date().toISOString(),
      status: order.status || "pending",
      order_status: order.order_status || "processing",
      delivered_at: order.delivered_at ?? null,
      total: parseFloat(order.total) || 0,
      shipping_address: order.shipping_address ?? null,
      customerName: userData
        ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
          userData.email ||
          "Customer"
        : "Guest Customer",
      customerEmail: userData?.email || "No email provided",
      items:
        Array.isArray(parsedItems) && parsedItems.length > 0
          ? parsedItems.map((item: OrderItem, index: number) => ({
              id: item.id || index + 1,
              itemName:
                item.itemName ||
                item.name ||
                item.product_name ||
                `Item ${index + 1}`,
              quantity: item.quantity || 1,
              price: parseFloat(String(item.price)) || 0,
              size: item.size || null,
              image: item.image || null,
            }))
          : [],
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error("Error in order detail API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
