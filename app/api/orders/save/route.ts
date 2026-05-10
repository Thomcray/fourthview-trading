import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { verifySignature } from "@/app/_lib/payment-intent";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reference, signature } = await req.json();

    if (!reference || !signature) {
      return NextResponse.json(
        { error: "Missing reference or signature" },
        { status: 400 },
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient(true);

    // Check if webhook already saved the order
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id, reference")
      .eq("reference", reference)
      .maybeSingle();

    if (existingOrder) {
      return NextResponse.json(
        { order: existingOrder, duplicate: false },
        { status: 200 },
      );
    }

    // Fetch intent to verify signature
    const { data: intent, error: intentError } = await supabase
      .from("payment_intents")
      .select("amount_kobo")
      .eq("reference", reference)
      .eq("user_id", session.user.id)
      .single();

    if (intentError || !intent) {
      return NextResponse.json(
        { error: "Invalid payment reference" },
        { status: 400 },
      );
    }

    if (!verifySignature(reference, intent.amount_kobo, signature)) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 403 },
      );
    }

    // Order not yet saved — webhook may still be in flight
    // Return success and let the client poll or wait
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Order save error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
