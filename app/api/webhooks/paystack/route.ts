import { createClient } from "@/app/_lib/supabase-server";
import { createNotification } from "@/app/_lib/create-notification";
import { getStoreSettings } from "@/app/_lib/settings";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  // Must use raw text — not req.json() — to verify signature
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  // Verify the request is genuinely from Paystack
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  // Acknowledge immediately — Paystack expects a fast 200 response
  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const { reference, amount } = event.data;

  try {
    const supabase = await createClient(true);

    // Check for duplicate — webhook can fire more than once
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("reference", reference)
      .maybeSingle();

    if (existingOrder) {
      return NextResponse.json(
        { received: true, duplicate: true },
        { status: 200 },
      );
    }

    // Fetch payment intent
    const { data: intent, error: intentError } = await supabase
      .from("payment_intents")
      .select("*")
      .eq("reference", reference)
      .single();

    if (intentError || !intent) {
      console.error("Intent not found for reference:", reference);
      return NextResponse.json({ error: "Intent not found" }, { status: 404 });
    }

    // Verify amount matches
    if (Math.abs(amount - intent.amount_kobo) > 1) {
      console.error("Amount mismatch:", {
        expected: intent.amount_kobo,
        received: amount,
      });
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // Save order
    const totalNGN = intent.amount_kobo / 100;
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          userId: intent.user_id,
          reference,
          total: totalNGN,
          status: "paid",
          order_status: "processing",
          items: intent.items,
          shipping_address: intent.shipping_address ?? null,
          payment_method: intent.payment_provider,
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error("Order insert failed:", orderError);
      return NextResponse.json(
        { error: "Failed to save order" },
        { status: 500 },
      );
    }

    // Mark intent as completed
    await supabase
      .from("payment_intents")
      .update({ status: "completed" })
      .eq("reference", reference);

    // Fire notification + email in parallel — non-blocking
    const settings = await getStoreSettings();
    Promise.all([
      createNotification({
        title: "New Order Placed",
        message: `Order #${order.reference} — ₦${totalNGN.toLocaleString()}`,
        type: "order",
        referenceId: order.id.toString(),
      }).catch((err) => console.error("Notification error:", err)),

      settings?.storeEmail
        ? resend.emails
            .send({
              from: "Fourthview Orders <onboarding@resend.dev>",
              to: settings.storeEmail,
              subject: `New Order #${reference} — ₦${totalNGN.toLocaleString()}`,
              html: `
              <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
                <h2 style="color:#1e3a8a">New Order Received</h2>
                <p><strong>Reference:</strong> ${reference}</p>
                <p><strong>Total:</strong> ₦${totalNGN.toLocaleString()}</p>
                ${
                  intent.shipping_address
                    ? `
                <p><strong>Shipping Address:</strong><br/>
                  ${intent.shipping_address.streetAddress}${intent.shipping_address.apartment ? `, ${intent.shipping_address.apartment}` : ""}<br/>
                  ${intent.shipping_address.city}, ${intent.shipping_address.zipCode}<br/>
                  ${intent.shipping_address.country}
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
                  <tbody>
                    ${(intent.items ?? [])
                      .map(
                        (item: {
                          itemName: string;
                          quantity: number;
                          price: number;
                        }) => `
                      <tr>
                        <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0">${item.itemName}</td>
                        <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${item.quantity}</td>
                        <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;text-align:right">¥${item.price.toLocaleString()}</td>
                      </tr>`,
                      )
                      .join("")}
                  </tbody>
                </table>
                <p style="margin-top:24px;color:#64748b;font-size:13px">
                  View this order in your 
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders/${order.id}" style="color:#2563eb">admin dashboard</a>.
                </p>
              </div>
            `,
            })
            .catch((err) => console.error("Email error:", err))
        : Promise.resolve(),
    ]);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
