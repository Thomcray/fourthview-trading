import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { sendStatusUpdateEmail } from "@/app/_lib/send-study-email";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient(true);

    const { id } = await params;

    const { data: application, error } = await supabase
      .from("study_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, adminNote } = await request.json();
    const supabase = await createClient(true);

    const { id } = await params;

    const { data, error } = await supabase
      .from("study_applications")
      .update({
        status,
        admin_note: adminNote,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send status update email
    await sendStatusUpdateEmail({
      fullName: data.full_name,
      email: data.email,
      applicationId: data.id,
      status,
      adminNote,
    }).catch((err) => console.error("Email error:", err));

    return NextResponse.json({ application: data });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 },
    );
  }
}
