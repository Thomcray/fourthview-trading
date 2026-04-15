import { NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase";

export async function POST(request: Request) {
  try {
    const { weight } = await request.json();

    if (!weight) {
      return NextResponse.json(
        { error: "Weight is required" },
        { status: 400 },
      );
    }

    const { data: config, error } = await supabase
      .from("shippingConfig")
      .select("rate_per_kg, base_rate")
      .single();

    // Use defaults if no config
    if (error || !config) {
      const defaultRate = 15;
      const shippingCost = parseFloat(weight) * defaultRate;

      return NextResponse.json({
        shippingCost: Math.round(shippingCost * 100) / 100,
        rate_per_kg: defaultRate,
        base_rate: 0,
        usingDefault: true,
      });
    }

    const shippingCost =
      parseFloat(weight) * config.rate_per_kg + (config.base_rate || 0);

    return NextResponse.json({
      shippingCost: Math.round(shippingCost * 100) / 100,
      rate_per_kg: config.rate_per_kg,
      base_rate: config.base_rate,
    });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
