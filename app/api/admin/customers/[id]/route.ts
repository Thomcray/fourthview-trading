import { authOptions } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userRole !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: customer, error } = await supabase
    .from("users")
    .select(
      "id, created_at, firstName, lastName, email, phone, country, countryCode, address, isVerified",
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 },
    );
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("userId", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ customer, orders: orders || [] });
}
