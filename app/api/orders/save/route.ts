import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { reference, total, items } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient(); // user context - their own order

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
