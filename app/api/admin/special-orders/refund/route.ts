import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";

const SPECIAL_ORDER_DEPOSIT = 50_000;

export async function POST(req: Request) {
  try {
    // 1. Make sure the admin is authenticated
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get the special-order ID
    const body = await req.json();
    const id = Number(body.id);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Valid special-order ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient(true);

    // 3. Get the special order
    const { data: specialOrder, error: orderError } = await supabase
      .from("specialOrders")
      .select(
        `
          id,
          email,
          deposit_amount,
          deposit_reference,
          deposit_status,
          deposit_paid_at,
          refund_reference,
          refund_status,
          refund_initiated_at
        `,
      )
      .eq("id", id)
      .single();

    if (orderError || !specialOrder) {
      console.error("Special order lookup error:", orderError);

      return NextResponse.json(
        { error: "Special order not found" },
        { status: 404 },
      );
    }

    // 4. Make sure the deposit has not already been refunded
    if (specialOrder.deposit_status === "refunded") {
      return NextResponse.json(
        {
          error: "This deposit has already been refunded.",
        },
        { status: 409 },
      );
    }

    // 5. Make sure this order actually has a paid deposit
    if (specialOrder.deposit_status !== "paid") {
      return NextResponse.json(
        {
          error: `This deposit cannot be refunded because its current status is "${specialOrder.deposit_status}".`,
        },
        { status: 400 },
      );
    }

    // 6. Make sure we have the Paystack transaction reference
    if (!specialOrder.deposit_reference) {
      return NextResponse.json(
        {
          error:
            "No Paystack transaction reference is attached to this deposit.",
        },
        { status: 400 },
      );
    }

    // 7. Prevent duplicate refund requests
    if (
      specialOrder.refund_status === "pending" ||
      specialOrder.refund_status === "processing"
    ) {
      return NextResponse.json(
        {
          error: "A refund is already being processed for this deposit.",
        },
        { status: 409 },
      );
    }

    // 8. Verify the original Paystack transaction
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        specialOrder.deposit_reference,
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const verifyResult = await verifyResponse.json();

    if (!verifyResponse.ok || !verifyResult.status) {
      console.error("Paystack transaction verification failed:", verifyResult);

      return NextResponse.json(
        { error: "Unable to verify the original Paystack transaction." },
        { status: 400 },
      );
    }

    const transaction = verifyResult.data;

    // 9. Confirm the original payment was successful
    if (transaction.status !== "success") {
      return NextResponse.json(
        {
          error: `The original payment is not successful. Current status: ${transaction.status}`,
        },
        { status: 400 },
      );
    }

    // 10. Confirm the original payment amount
    const expectedAmount = SPECIAL_ORDER_DEPOSIT * 100;

    if (transaction.amount !== expectedAmount) {
      console.error("Invalid original deposit amount:", {
        expected: expectedAmount,
        received: transaction.amount,
        reference: specialOrder.deposit_reference,
      });

      return NextResponse.json(
        {
          error:
            "The original transaction amount does not match the ₦50,000 deposit.",
        },
        { status: 400 },
      );
    }

    // 11. Confirm the original payment currency
    if (transaction.currency !== "NGN") {
      return NextResponse.json(
        {
          error: "The original deposit was not paid in NGN.",
        },
        { status: 400 },
      );
    }

    // 12. Request the full ₦50,000 refund from Paystack
    const refundResponse = await fetch("https://api.paystack.co/refund", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction: specialOrder.deposit_reference,
        amount: SPECIAL_ORDER_DEPOSIT * 100,
      }),
    });

    const refundResult = await refundResponse.json();

    if (!refundResponse.ok || !refundResult.status) {
      console.error("Paystack refund request failed:", refundResult);

      return NextResponse.json(
        {
          error: refundResult.message ?? "Unable to initiate the refund.",
        },
        { status: 400 },
      );
    }

    const refund = refundResult.data;

    // 13. Store the refund information without marking it as fully refunded
    const refundReference =
      refund?.transaction_reference ??
      refund?.reference ??
      refund?.id?.toString() ??
      null;

    const refundStatus = refund?.status ?? "pending";

    const { data: updatedOrder, error: updateError } = await supabase
      .from("specialOrders")
      .update({
        refund_reference: refundReference,
        refund_status: refundStatus,
        refund_initiated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("deposit_status", "paid")
      .select()
      .single();

    if (updateError || !updatedOrder) {
      console.error("Failed to save refund information:", updateError);

      return NextResponse.json(
        {
          error:
            "The refund was requested from Paystack, but we could not update the special-order record. Please check the Paystack refund status before retrying.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "The ₦50,000 refund has been requested successfully.",
      specialOrderId: id,
      depositAmount: SPECIAL_ORDER_DEPOSIT,
      refundReference,
      refundStatus,
    });
  } catch (error) {
    console.error("Special-order refund error:", error);

    return NextResponse.json(
      {
        error: "An unexpected error occurred while processing the refund.",
      },
      { status: 500 },
    );
  }
}
