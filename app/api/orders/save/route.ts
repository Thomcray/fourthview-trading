import { authOptions } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { reference, total, items } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        userId: session.user.id,
        reference,
        total,
        status: "paid",
        items,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 },
    );
  }

  return NextResponse.json({ order: data });
}
