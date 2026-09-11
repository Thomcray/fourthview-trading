import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";

export async function GET(req: NextRequest) {
  try {
    const carId = new URL(req.url).searchParams.get("carId");
    if (!carId) {
      return NextResponse.json({ error: "carId is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: reviews, error } = await supabase
      .from("carReviews")
      .select("*")
      .eq("carId", Number(carId))
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ reviews: reviews || [] });
  } catch (error) {
    console.error("Error fetching car reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { carId, rating, comment } = await req.json();

    if (!carId || !Number(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "A rating between 1 and 5 is required" },
        { status: 400 },
      );
    }

    const userId = session.user.email as string;
    const userName =
      [session.user.firstName, session.user.lastName]
        .filter(Boolean)
        .join(" ") || session.user.email;

    const supabase = await createClient(true);

    // One review per user per car
    const { data: existing } = await supabase
      .from("carReviews")
      .select("id")
      .eq("carId", Number(carId))
      .eq("userId", userId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this car" },
        { status: 400 },
      );
    }

    const { data: review, error } = await supabase
      .from("carReviews")
      .insert([
        {
          carId: Number(carId),
          userId,
          userName,
          rating: Number(rating),
          comment: (comment || "").trim(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error creating car review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 },
    );
  }
}
