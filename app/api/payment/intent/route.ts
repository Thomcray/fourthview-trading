import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { generateReference, createSignature } from "@/app/_lib/payment-intent";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

interface CartItem {
  productId: string;
  quantity?: number;
  discount?: number;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      items,
      shippingAddress,
      paymentMethod = "paystack",
    } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty items" },
        { status: 400 },
      );
    }

    const supabase = await createClient(true);

    // Fetch products with current prices
    const productIds = items.map((i: CartItem) => i.productId).filter(Boolean);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, price, shippingCost, discount")
      .in("id", productIds);

    if (productsError || !products || products.length === 0) {
      console.error("Failed to fetch products:", productsError);
      return NextResponse.json(
        { error: "Failed to verify products" },
        { status: 500 },
      );
    }

    // Validate all items have matching products
    const missingProducts = productIds.filter(
      (id) => !products.find((p) => p.id === id),
    );
    if (missingProducts.length > 0) {
      return NextResponse.json(
        { error: `Invalid products: ${missingProducts.join(", ")}` },
        { status: 400 },
      );
    }

    // Fetch current exchange rate
    const { data: rateData, error: rateError } = await supabase
      .from("ExchangeRateCache")
      .select("rates")
      .order("fetchedAt", { ascending: false })
      .limit(1)
      .single();

    if (rateError || !rateData?.rates?.NGN) {
      console.error("Failed to fetch rates:", rateError);
      return NextResponse.json(
        { error: "Exchange rates temporarily unavailable" },
        { status: 503 },
      );
    }

    const ngnRate = rateData.rates.NGN;

    // Calculate totals server-side (never trust client)
    let totalCNY = 0;
    const validatedItems = items.map((item: CartItem) => {
      const product = products.find((p) => p.id === item.productId)!;
      const basePrice = product.price;
      const discount = item.discount ?? product.discount ?? 0;
      const unitPrice =
        discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
      const quantity = Math.max(1, Math.round(item.quantity ?? 1));
      const shipping = product.shippingCost ?? 0;
      const itemTotal = unitPrice * quantity + shipping;

      totalCNY += itemTotal;

      return {
        ...item,
        unitPrice,
        quantity,
        shipping,
        itemTotal,
      };
    });

    const totalNGN = totalCNY * ngnRate;
    const amountKobo = Math.round(totalNGN * 100);

    if (amountKobo <= 0) {
      return NextResponse.json(
        { error: "Invalid order total" },
        { status: 400 },
      );
    }

    // Generate reference and signature
    const reference = generateReference();
    const signature = createSignature(reference, amountKobo);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // Store intent
    const { error: insertError } = await supabase
      .from("payment_intents")
      .insert({
        reference,
        user_id: session.user.id,
        amount_kobo: amountKobo,
        amount_ngn: totalNGN,
        currency: "NGN",
        items: validatedItems,
        shipping_address: shippingAddress ?? null,
        signature,
        status: "pending",
        payment_provider: paymentMethod,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Failed to store intent:", insertError);
      return NextResponse.json(
        { error: "Failed to initialize payment" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      reference,
      amount: amountKobo,
      currency: "NGN",
      signature,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
