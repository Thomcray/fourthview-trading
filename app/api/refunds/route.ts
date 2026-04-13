import { NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("refunds")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ refunds: data });
  } catch (error) {
    console.error("Error fetching refunds:", error);
    return NextResponse.json(
      { error: "Failed to fetch refunds" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      customerId,
      customerName,
      customerEmail,
      amount,
      reason,
      refundMethod,
      originalTotal,
    } = body;

    // Validate
    if (!orderId || !customerId || !amount || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (amount > originalTotal) {
      return NextResponse.json(
        { error: "Refund amount cannot exceed order total" },
        { status: 400 },
      );
    }

    // Create refund record
    const { data, error } = await supabase
      .from("refunds")
      .insert({
        order_id: orderId,
        customer_id: customerId,
        customer_name: customerName,
        customer_email: customerEmail,
        amount,
        reason,
        refund_method: refundMethod,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Optionally update order status to "refunded"
    await supabase
      .from("orders")
      .update({ status: "refund_requested" })
      .eq("id", orderId);

    return NextResponse.json({
      refund: data,
      message: "Refund request created",
    });
  } catch (error) {
    console.error("Error creating refund:", error);
    return NextResponse.json(
      { error: "Failed to create refund" },
      { status: 500 },
    );
  }
}
