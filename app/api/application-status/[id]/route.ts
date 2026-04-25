import { createClient } from "@/app/_lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient(true);
    const { id } = await params;

    const { data: application, error } = await supabase
      .from("study_applications")
      .select(
        "id, full_name, email, whatsapp_number, status, admin_note, created_at, updated_at",
      )
      // intentionally excludes documents and other sensitive fields
      .eq("id", id)
      .single();

    if (error || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ application });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 },
    );
  }
}
