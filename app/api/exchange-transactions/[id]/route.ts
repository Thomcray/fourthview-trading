import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json(); // { status: "confirmed" | "rejected" | "completed", adminNote?: string }
  const supabase = await createClient(true);

  const updates: Record<string, unknown> = {
    status: body.status,
    adminNote: body.adminNote ?? null,
  };

  if (body.status === "confirmed" || body.status === "completed") {
    updates.confirmedAt = new Date().toISOString();
    updates.confirmedBy = session.user.email ?? session.user.name ?? "admin";
  }

  const { data, error } = await supabase
    .from("exchangeTransactions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ transaction: data });
}
