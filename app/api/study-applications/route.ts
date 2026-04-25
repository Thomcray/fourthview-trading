import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { NextResponse } from "next/server";
import { sendApplicationConfirmation } from "@/app/_lib/send-study-email";

// ─── GET: Admin only - list all applications ───
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

// ─── POST: Public - create new application ───
export async function POST(req: Request) {
  try {
    const supabase = await createClient(true);
    const body = await req.json();

    const { data: application, error } = await supabase
      .from("study_applications")
      .insert([
        {
          full_name: body.fullName,
          email: body.email,
          whatsapp_number: body.whatsappNumber,
          country: body.country,
          preferred_university: body.preferredUniversity,
          preferred_program: body.preferredProgram,
          message: body.message,
          documents: body.documents ?? {},
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send confirmation email
    await sendApplicationConfirmation({
      fullName: body.fullName,
      email: body.email,
      applicationId: application.id,
    }).catch((err) => console.error("Confirmation email error:", err));

    return NextResponse.json(application);
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 },
    );
  }
}

// ─── PATCH: Public - update application documents ───
export async function PATCH(req: Request) {
  try {
    const supabase = await createClient(true);
    const body = await req.json();

    const { data, error } = await supabase
      .from("study_applications")
      .update({ documents: body.documents })
      .eq("id", body.applicationId)
      .select()
      .single();

    if (error) {
      console.error("PATCH error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("PATCH catch error:", error);
    return NextResponse.json(
      { error: "Failed to update documents" },
      { status: 500 },
    );
  }
}
