import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to view this application." },
        { status: 401 },
      );
    }

    const userId = Number(session.user.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { error: "Invalid user account." },
        { status: 401 },
      );
    }

    const supabase = await createClient(true);
    const { id } = await params;

    // Only allow the owner of the application to view it
    // Intentionally excludes documents and other sensitive fields
    const { data: application, error } = await supabase
      .from("study_applications")
      .select(
        "id, full_name, email, whatsapp_number, status, admin_note, created_at, updated_at",
      )
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("GET application status error:", error);

    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 },
    );
  }
}
