import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { error: "Reference required" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json();

    if (!res.ok || !data.status) {
      return NextResponse.json(
        { error: data.message || "Verification failed" },
        { status: 400 },
      );
    }

    // Ensure transaction was actually successful
    if (data.data.status !== "success") {
      return NextResponse.json(
        { error: `Transaction status: ${data.data.status}` },
        { status: 400 },
      );
    }

    return NextResponse.json({
      verified: true,
      amount: data.data.amount,
      currency: data.data.currency,
      reference: data.data.reference,
      data: data.data, // Full transaction data
    });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
