import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { sendOrderStatusEmail } from "@/app/_lib/email";

// Define types
// type OrderItem = {
//   id: number;
//   quantity: number;
//   price: number;
//   product?: {
//     id: number;
//     name: string;
//   };
// };

type UpdateData = {
  order_status: string;
  updated_at: string;
  shipped_at?: string;
  delivered_at?: string;
};

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.userRole !== "admin") {
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

    const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const supabase = await createClient(true);

    const { data: currentOrder, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !currentOrder) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Fetch user separately
    const { data: user } = await supabase
      .from("users")
      .select("id, email, firstName, lastName")
      .eq("id", currentOrder.userId)
      .single();

    if (currentOrder.order_status === status) {
      return NextResponse.json(
        { message: "Order is already in this status" },
        { status: 400 },
      );
    }

    const updateData: UpdateData = {
      order_status: status,
      updated_at: new Date().toISOString(),
    };

    // comment out for now. will add to db schema later.
    // if (status === "shipped") {
    //   updateData.shipped_at = new Date().toISOString();
    // }
    if (status === "delivered") {
      updateData.delivered_at = new Date().toISOString();
    }

    // Update order
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return NextResponse.json(
        { message: "Failed to update order" },
        { status: 500 },
      );
    }

    let emailSent = false;
    const customerEmail = user?.email;
    if (notify && customerEmail) {
      try {
        await sendOrderStatusEmail({
          to: customerEmail,
          orderReference: currentOrder.reference,
          status,
          customerName: user?.firstName || customerEmail,
          total: currentOrder.total,
        });
        emailSent = true;
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
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
