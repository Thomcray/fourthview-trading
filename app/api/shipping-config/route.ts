// app/api/shipping-config/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase"; // _lib with underscore

export async function GET() {
  const { data, error } = await supabase
    .from("shippingConfig")
    .select("*")
    .single();

  if (error || !data) {
    // Return default config
    return NextResponse.json({
      rate_per_kg: 15,
      base_rate: 0,
      free_shipping_threshold: 500,
      currency: "CNY",
    });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();

  const { data: existing } = await supabase
    .from("shippingConfig")
    .select("id")
    .single();

  let result;

  if (existing) {
    result = await supabase
      .from("shippingConfig")
      .update(body)
      .eq("id", existing.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from("shippingConfig")
      .insert([body])
      .select()
      .single();
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
