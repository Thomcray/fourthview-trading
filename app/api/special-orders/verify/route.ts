import { NextRequest, NextResponse } from "next/server";

const SPECIAL_ORDER_DEPOSIT = 50_000;

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const result = await response.json();

    if (!response.ok || !result.status) {
      console.error("Paystack verification failed:", result);

      return NextResponse.json(
        { error: "Unable to verify payment" },
        { status: 400 },
      );
    }

    const transaction = result.data;

    // Paystack amounts are returned in kobo.
    const expectedAmount = SPECIAL_ORDER_DEPOSIT * 100;

    if (transaction.status !== "success") {
      return NextResponse.json(
        {
          error: "Payment was not successful",
          status: transaction.status,
        },
        { status: 400 },
      );
    }

    if (transaction.amount !== expectedAmount) {
      console.error("Invalid special-order deposit amount:", {
        expected: expectedAmount,
        received: transaction.amount,
        reference,
      });

      return NextResponse.json(
        { error: "Invalid deposit amount" },
        { status: 400 },
      );
    }

    if (transaction.currency !== "NGN") {
      return NextResponse.json(
        { error: "Invalid payment currency" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      reference: transaction.reference,
      amount: transaction.amount,
      currency: transaction.currency,
      paidAt: transaction.paid_at,
    });
  } catch (error) {
    console.error("Special-order payment verification error:", error);

    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
