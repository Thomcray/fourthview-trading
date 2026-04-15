// app/api/orders/update-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { sendOrderStatusEmail } from "@/app/_lib/email";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is admin
    if (!session?.user || session.user.userRole !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, notify = true } = body;

    if (!id || !status) {
      return NextResponse.json(
        { message: "Order ID and status are required" },
        { status: 400 },
      );
    }

    // Validate status transition
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // Await the supabase client
    const supabase = await createClient();

    // Get current order with user details
    const { data: currentOrder, error: fetchError } = await supabase
      .from("orders")
      .select(
        `
        *,
        user:user_id (
          id,
          email,
          firstName,
          lastName
        ),
        items:order_items (
          id,
          quantity,
          price,
          product:product_id (
            id,
            name
          )
        )
      `,
      )
      .eq("id", id)
      .single();

    if (fetchError || !currentOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Check if status is actually changing
    if (currentOrder.status === status) {
      return NextResponse.json(
        { message: "Order is already in this status" },
        { status: 400 },
      );
    }

    // Build update data
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Add tracking timestamps
    if (status === "shipped") {
      updateData.shipped_at = new Date().toISOString();
    }
    if (status === "delivered") {
      updateData.delivered_at = new Date().toISOString();
    }

    // Update order in database
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        user:user_id (
          id,
          email,
          firstName,
          lastName
        ),
        items:order_items (
          id,
          quantity,
          price,
          product:product_id (
            id,
            name
          )
        )
      `,
      )
      .single();

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return NextResponse.json(
        { message: "Failed to update order" },
        { status: 500 },
      );
    }

    // Send notification email if requested
    let emailSent = false;
    const customerEmail = currentOrder.user?.email;

    if (notify && customerEmail) {
      try {
        const customerName =
          currentOrder.user?.firstName || currentOrder.user?.email;

        await sendOrderStatusEmail({
          to: customerEmail,
          orderReference: currentOrder.reference,
          status: status,
          customerName: customerName,
          items: currentOrder.items || [],
          total: currentOrder.total,
        });
        emailSent = true;
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the request if email fails, just log it
      }
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      notified: emailSent,
      message: emailSent
        ? `Order status updated to ${status} and customer notified`
        : `Order status updated to ${status}`,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
