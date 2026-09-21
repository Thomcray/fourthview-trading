import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient(true);

    const body = await request.json();
    const orderId = Number(body.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        { message: "A valid order ID is required." },
        { status: 400 },
      );
    }

    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("id, is_deleted")
      .eq("id", orderId)
      .single();

    if (findError || !order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 },
      );
    }

    if (order.is_deleted) {
      return NextResponse.json(
        { message: "Order has already been removed." },
        { status: 409 },
      );
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        is_deleted: true,
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Soft delete order error:", updateError);

      return NextResponse.json(
        { message: "Failed to remove order." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order removed successfully.",
    });
  } catch (error) {
    console.error("Delete order API error:", error);

    return NextResponse.json(
      { message: "Failed to remove order." },
      { status: 500 },
    );
  }
}
