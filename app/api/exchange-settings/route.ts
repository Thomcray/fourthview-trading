import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { headers } from "next/headers";

export async function GET() {
  const supabase = await createClient(true);

  const { data: settings, error } = await supabase
    .from("ExchangeSettings")
    .select("*")
    .limit(1)
    .single();

  if (error || !settings) {
    const { data: created } = await supabase
      .from("ExchangeSettings")
      .insert({ rateMargin: 0, autoUpdate: true, updateInterval: 60 })
      .select()
      .single();
    return NextResponse.json(created);
  }

  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.userRole !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const userId = session.user.id;

    if (
      typeof body.rateMargin !== "number" ||
      body.rateMargin < 0 ||
      body.rateMargin > 100
    ) {
      return NextResponse.json({ error: "rateMargin 0-100" }, { status: 400 });
    }

    const supabase = await createClient(true);

    const { data: current } = await supabase
      .from("ExchangeSettings")
      .select("*")
      .limit(1)
      .single();

    if (!current)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const oldMargin = current.rateMargin;

    const { data: updated, error } = await supabase
      .from("ExchangeSettings")
      .update({
        rateMargin: body.rateMargin,
        autoUpdate: body.autoUpdate,
        updateInterval: body.updateInterval,
        updatedAt: new Date().toISOString(),
        updatedBy: userId,
      })
      .eq("id", current.id)
      .select()
      .single();

    if (error) throw error;

    if (oldMargin !== body.rateMargin) {
      const headerList = await headers();

      await supabase.from("ExchangeRateLog").insert({
        adminId: userId,
        oldMargin,
        newMargin: body.rateMargin,
        reason: body.reason || null,
        ipAddress: headerList.get("x-forwarded-for") || "unknown",
        userAgent: headerList.get("user-agent") || "unknown",
      });
    }

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
