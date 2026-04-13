import { NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    const refundId = parseInt(id);

    const { data, error } = await supabase
      .from("refunds")
      .update({
        status,
        processed_at: status === "completed" ? new Date().toISOString() : null,
      })
      .eq("id", refundId)
      .select()
      .single();

    if (error) throw error;

    if (status === "completed") {
      await supabase
        .from("orders")
        .update({ status: "refunded" })
        .eq("id", data.order_id);
    }

    return NextResponse.json({ refund: data });
  } catch (error) {
    console.error("Error updating refund:", error);
    return NextResponse.json(
      { error: "Failed to update refund" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const refundId = parseInt(id);

    const { data, error } = await supabase
      .from("refunds")
      .select("*")
      .eq("id", refundId)
      .single();

    if (error) throw error;

    return NextResponse.json({ refund: data });
  } catch (error) {
    console.error("Error fetching refund:", error);
    return NextResponse.json(
      { error: "Failed to fetch refund" },
      { status: 500 },
    );
  }
}
