import { NextResponse } from "next/server";
import { createClient } from "@/app/_lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: cars, error } = await supabase
      .from("cars")
      .select(
        "id, created_at, brandName, year, condition, mileage, price, shippingCost, clearingCost, totalPrice, imageUrl, sold",
      )
      .order("id", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ cars: cars || [] });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 },
    );
  }
}
