import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { NextResponse } from "next/server";
import { getStudyPricing } from "@/app/_lib/study-pricing-server";

const isValidAmount = (v: unknown): v is number =>
  typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 1_000_000;

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(await getStudyPricing());
  } catch {
    return NextResponse.json({ error: "Pricing unavailable" }, { status: 503 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (
    !isValidAmount(body.applicationFee) ||
    !isValidAmount(body.scholarshipBalance) ||
    !isValidAmount(body.selfSponsorBalance)
  ) {
    return NextResponse.json(
      { error: "All amounts must be whole numbers of 0 or more." },
      { status: 400 },
    );
  }

  const supabase = await createClient(true);

  const { error } = await supabase
    .from("study_pricing")
    .update({
      application_fee: body.applicationFee,
      scholarship_balance: body.scholarshipBalance,
      self_sponsor_balance: body.selfSponsorBalance,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    console.error("Update study pricing error:", error);
    return NextResponse.json(
      { error: "Failed to save pricing." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
