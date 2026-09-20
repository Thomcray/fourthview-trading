import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { sendApplicationConfirmation } from "@/app/_lib/send-study-email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in." },
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

    const body = await req.json();

    if (!body.applicationId) {
      return NextResponse.json(
        { error: "Application ID is required." },
        { status: 400 },
      );
    }

    const supabase = await createClient(true);

    const { data: application, error } = await supabase
      .from("study_applications")
      .select("id, full_name, email, documents")
      .eq("id", body.applicationId)
      .eq("user_id", userId)
      .single();

    if (error || !application) {
      return NextResponse.json(
        { error: "Application not found or access denied." },
        { status: 404 },
      );
    }

    if (
      !application.documents ||
      typeof application.documents !== "object" ||
      Object.keys(application.documents).length === 0
    ) {
      return NextResponse.json(
        { error: "Application documents have not been uploaded." },
        { status: 400 },
      );
    }

    await sendApplicationConfirmation({
      fullName: application.full_name,
      email: application.email,
      applicationId: application.id,
    });

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent.",
    });
  } catch (error) {
    console.error("Confirmation email error:", error);

    return NextResponse.json(
      { error: "Failed to send confirmation email." },
      { status: 500 },
    );
  }
}
