import { authOptions } from "@/app/_lib/auth";
import { createNotification } from "@/app/_lib/create-notification";
import { createClient } from "@/app/_lib/supabase-server";
import { verifySignature } from "@/app/_lib/payment-intent";
import { getStoreSettings } from "@/app/_lib/settings";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      reference,
      signature,
      items,
      shippingAddress,
      paymentMethod = "paystack",
    } = await req.json();

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

    // Check for duplicate order
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id, reference")
      .eq("reference", reference)
      .maybeSingle();

    if (existingOrder) {
      return NextResponse.json(
        { order: existingOrder, duplicate: true },
        { status: 200 },
      );
    }

    // Fetch and validate payment intent
    const { data: intent, error: intentError } = await supabase
      .from("payment_intents")
      .select("*")
      .eq("reference", reference)
      .eq("user_id", session.user.id)
      .single();

    if (intentError || !intent) {
      return NextResponse.json(
        { error: "Invalid payment reference" },
        { status: 400 },
      );
    }

    // Check expiry
    if (new Date(intent.expires_at) < new Date()) {
      await supabase
        .from("payment_intents")
        .update({ status: "expired" })
        .eq("reference", reference);

      return NextResponse.json(
        { error: "Payment session expired. Please refresh and try again." },
        { status: 400 },
      );
    }

    // Verify signature
    if (!verifySignature(reference, intent.amount_kobo, signature)) {
      console.error("Signature mismatch:", { reference, signature });
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 403 },
      );
    }

    // Verify with Paystack
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    if (!paystackRes.ok) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 },
      );
    }

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data.status !== "success") {
      await supabase
        .from("payment_intents")
        .update({ status: "failed" })
        .eq("reference", reference);

      return NextResponse.json(
        { error: "Payment was not successful" },
        { status: 400 },
      );
    }

    // Verify amount matches intent
    if (paystackData.data.amount !== intent.amount_kobo) {
      console.error("Paystack amount mismatch:", {
        expected: intent.amount_kobo,
        received: paystackData.data.amount,
      });

      await supabase
        .from("payment_intents")
        .update({
          status: "failed",
          paystack_reference: paystackData.data.reference,
        })
        .eq("reference", reference);

      return NextResponse.json(
        { error: "Payment amount mismatch detected. Please contact support." },
        { status: 400 },
      );
    }

    // Mark intent as processing
    await supabase
      .from("payment_intents")
      .update({
        status: "processing",
        paystack_reference: paystackData.data.reference,
      })
      .eq("reference", reference);

    // Save order
    const totalNGN = intent.amount_kobo / 100;
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          userId: session.user.id,
          reference,
          total: totalNGN,
          status: "paid",
          order_status: "processing",
          items,
          shipping_address: shippingAddress ?? null,
          payment_method: paymentMethod,
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error("Order insert failed:", orderError);
      await supabase
        .from("payment_intents")
        .update({ status: "failed" })
        .eq("reference", reference);

      return NextResponse.json(
        { error: "Failed to save order. Please contact support." },
        { status: 500 },
      );
    }

    // Mark intent as completed
    await supabase
      .from("payment_intents")
      .update({ status: "completed" })
      .eq("reference", reference);

    // Send notification
    await createNotification({
      title: "New Order Placed",
      message: `Order #${order.reference} — ₦${totalNGN.toLocaleString()}`,
      type: "order",
      referenceId: order.id.toString(),
    }).catch((err) => console.error("Notification error:", err));

    // Send email notification
    const settings = await getStoreSettings();
    if (settings?.storeEmail) {
      const customerName =
        `${session.user.firstName ?? ""} ${session.user.lastName ?? ""}`.trim() ||
        "A customer";
      const customerEmail = session.user.email ?? "N/A";
      const itemRows = (items ?? [])
        .map(
          (item: { itemName: string; quantity: number; price: number }) =>
            `<tr>
              <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0">${item.itemName}</td>
              <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${item.quantity}</td>
              <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;text-align:right">¥${item.price.toLocaleString()}</td>
            </tr>`,
        )
        .join("");

      await resend.emails
        .send({
          from: "Fourthview Orders <onboarding@resend.dev>",
          to: settings.storeEmail,
          replyTo: customerEmail,
          subject: `New Order #${reference} — ₦${totalNGN.toLocaleString()}`,
          html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#1e3a8a">New Order Received</h2>
            <p><strong>Reference:</strong> ${reference}</p>
            <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
            <p><strong>Total:</strong> ₦${totalNGN.toLocaleString()}</p>
            ${
              shippingAddress
                ? `
            <p><strong>Shipping Address:</strong><br/>
              ${shippingAddress.streetAddress}${shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ""}<br/>
              ${shippingAddress.city}, ${shippingAddress.zipCode}<br/>
              ${shippingAddress.country}
            </p>`
                : ""
            }
            <h3 style="color:#1e3a8a;margin-top:24px">Order Items</h3>
            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr style="background:#f8fafc">
                  <th style="padding:8px 12px;text-align:left">Item</th>
                  <th style="padding:8px 12px;text-align:center">Qty</th>
                  <th style="padding:8px 12px;text-align:right">Price (CNY)</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>
            <p style="margin-top:24px;color:#64748b;font-size:13px">
              View this order in your 
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders/${order.id}" style="color:#2563eb">admin dashboard</a>.
            </p>
          </div>
        `,
        })
        .catch((err) => console.error("Order email error:", err));
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Order save error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
