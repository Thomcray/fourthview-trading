import { authOptions } from "@/app/_lib/auth";
import { createNotification } from "@/app/_lib/create-notification";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reference, total, items, shippingAddress } = await req.json();

    // Validate required fields
    if (!reference || total === undefined || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Missing required fields: reference, total, items" },
        { status: 400 },
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient(true);

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          userId: session.user.id,
          reference,
          total,
          status: "paid",
          order_status: "processing",
          items: items,
          shipping_address: shippingAddress ?? null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Notification
    await createNotification({
      title: "New Order Placed",
      message: `Order #${data.reference} — ₦${total.toLocaleString()}`,
      type: "order",
      referenceId: data.id.toString(),
    }).catch((err) => console.error("Notification error:", err));

    return NextResponse.json({ order: data }, { status: 201 });
  } catch (error) {
    console.error("Order save error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
