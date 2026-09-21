import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";

const VALID_RANGES = ["today", "week", "month", "year", "all"] as const;

type AnalyticsRange = (typeof VALID_RANGES)[number];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;

    const requestedRange = searchParams.get("range") ?? "month";

    if (!VALID_RANGES.includes(requestedRange as AnalyticsRange)) {
      return NextResponse.json(
        { error: "Invalid analytics range" },
        { status: 400 },
      );
    }

    const range = requestedRange as AnalyticsRange;

    const supabase = await createClient(true);

    const { data, error } = await supabase.rpc("get_admin_analytics", {
      p_range: range,
    });

    if (error) {
      console.error("Analytics RPC error:", error);

      return NextResponse.json(
        {
          error: "Failed to fetch analytics data",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Analytics API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
