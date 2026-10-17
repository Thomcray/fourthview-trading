import { NextResponse } from "next/server";
import { getStudyPricing } from "@/app/_lib/study-pricing-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getStudyPricing());
  } catch (err) {
    console.error("study-pricing GET error:", err);
    return NextResponse.json({ error: "Pricing unavailable" }, { status: 503 });
  }
}
