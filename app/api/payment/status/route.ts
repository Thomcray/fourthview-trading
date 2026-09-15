import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { error: "Missing payment reference" },
        { status: 400 },
      );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient(true);

    // Make sure this payment belongs to the logged-in user
    const { data: intent, error: intentError } = await supabase
      .from("payment_intents")
      .select("reference, status, user_id")
      .eq("reference", reference)
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (intentError) {
      console.error("Payment status lookup error:", intentError);

      return NextResponse.json(
        { error: "Failed to check payment status" },
        { status: 500 },
      );
    }

    if (!intent) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Payment intent has been completed by the webhook
    if (intent.status === "completed") {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("id, reference")
        .eq("reference", reference)
        .maybeSingle();

      if (orderError) {
        console.error("Order lookup error:", orderError);

        return NextResponse.json(
          { error: "Failed to check order" },
          { status: 500 },
        );
      }

      if (order) {
        return NextResponse.json({
          status: "completed",
          orderId: order.id,
          reference: order.reference,
        });
      }
    }

    // Webhook hasn't finished creating the order yet
    return NextResponse.json({
      status: "pending",
    });
  } catch (error) {
    console.error("Payment status error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
