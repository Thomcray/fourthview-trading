import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reference, total, items } = await req.json();

    // Validate required fields
    if (!reference || total === undefined || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Missing required fields: reference, total, items" },
        { status: 400 },
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient(true);

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          userId: session.user.id,
          reference,
          total,
          status: "paid",
          items: items,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order: data }, { status: 201 });
  } catch (error) {
    console.error("Order save error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
