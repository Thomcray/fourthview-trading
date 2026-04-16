import { createClient } from "@/app/_lib/supabase-server";
import { authOptions } from "@/app/_lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient(true);

  const { data, error } = await supabase
    .from("shippingConfig")
    .select("*")
    .single();

  if (error || !data) {
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
  // Add auth check for admin-only access
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userRole !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const supabase = await createClient(true);

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
