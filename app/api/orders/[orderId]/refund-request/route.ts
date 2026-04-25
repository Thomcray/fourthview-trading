import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    const supabase = await createClient(true);

    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("userId", session.user.id) // ensure it belongs to this user
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check order is delivered
    if (order.order_status !== "delivered") {
      return NextResponse.json(
        { error: "Only delivered orders can be refunded" },
        { status: 400 },
      );
    }

    // Check 7-day window
    if (!order.delivered_at) {
      return NextResponse.json(
        { error: "Delivery date not found" },
        { status: 400 },
      );
    }

    const deliveredAt = new Date(order.delivered_at);
    const now = new Date();
    const daysSinceDelivery =
      (now.getTime() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceDelivery > 7) {
      return NextResponse.json(
        {
          error:
            "Refund window has expired. Refunds must be requested within 7 days of delivery.",
        },
        { status: 400 },
      );
    }

    // Check no existing pending refund for this order
    const { data: existingRefund } = await supabase
      .from("refunds")
      .select("id, status")
      .eq("order_id", orderId)
      .in("status", ["pending", "approved", "completed"])
      .maybeSingle();

    if (existingRefund) {
      return NextResponse.json(
        { error: "A refund request already exists for this order" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { reason, evidenceUrls } = body;

    if (!reason?.trim()) {
      return NextResponse.json(
        { error: "Please provide a reason for the refund" },
        { status: 400 },
      );
    }

    // Create refund record
    const { data: refund, error: refundError } = await supabase
      .from("refunds")
      .insert({
        order_id: order.id,
        transaction_reference: order.reference,
        customer_id: session.user.id,
        customer_name:
          `${session.user.firstName ?? ""} ${session.user.lastName ?? ""}`.trim(),
        customer_email: session.user.email,
        amount: order.total,
        reason,
        evidence_urls: evidenceUrls ?? [],
        refund_method: "original",
        status: "pending",
      })
      .select()
      .single();

    if (refundError) {
      console.error("Refund insert error:", refundError);
      return NextResponse.json({ error: refundError.message }, { status: 500 });
    }

    return NextResponse.json({
      refund,
      message: "Refund request submitted successfully",
    });
  } catch (err) {
    console.error("Refund request error:", err);
    return NextResponse.json(
      { error: "Failed to submit refund request" },
      { status: 500 },
    );
  }
}
