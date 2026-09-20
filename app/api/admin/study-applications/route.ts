import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = await createClient(true);

    const { data, error } = await supabase
      .from("study_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);

      return NextResponse.json(
        { error: "Failed to fetch applications" },
        { status: 500 },
      );
    }

    return NextResponse.json({ applications: data });
  } catch (error) {
    console.error("Study applications GET error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
