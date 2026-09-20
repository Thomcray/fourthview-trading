import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { NextResponse } from "next/server";
import { createNotification } from "@/app/_lib/create-notification";
import { sendAdminStudyApplicationEmail } from "@/app/_lib/email";
import { getStoreSettings } from "@/app/_lib/settings";

// POST: Create a new application for the authenticated user
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to apply." },
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
    const body = await req.json();

    const age = Number(body.age);

    if (!Number.isInteger(age) || age < 1 || age > 120) {
      return NextResponse.json(
        { error: "Please provide a valid age" },
        { status: 400 },
      );
    }

    if (
      !body.fullName ||
      !body.email ||
      !body.whatsappNumber ||
      !body.country ||
      !body.preferredUniversity ||
      !body.preferredProgram
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    const { data: application, error } = await supabase
      .from("study_applications")
      .insert([
        {
          user_id: userId,
          full_name: body.fullName,
          email: body.email,
          whatsapp_number: body.whatsappNumber,
          country: body.country,
          age,
          preferred_university: body.preferredUniversity,
          preferred_program: body.preferredProgram,
          message: body.message ?? null,
          documents: {},
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);

      return NextResponse.json(
        { error: "Failed to create application." },
        { status: 500 },
      );
    }

    // Notify administrators
    const settings = await getStoreSettings();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    await Promise.all([
      createNotification({
        title: "New Study Application",
        message: `${body.fullName} applied for ${
          body.preferredProgram || "a program"
        }`,
        type: "study_application",
        referenceId: application.id.toString(),
      }).catch((err) => {
        console.error("Notification error:", err);
      }),

      settings?.storeEmail?.trim()
        ? sendAdminStudyApplicationEmail({
            to: settings.storeEmail.trim(),
            applicationId: application.id,
            fullName: body.fullName,
            email: body.email,
            whatsappNumber: body.whatsappNumber,
            country: body.country,
            age,
            preferredUniversity: body.preferredUniversity,
            preferredProgram: body.preferredProgram,
            message: body.message ?? null,
            baseUrl,
          }).catch((err) => {
            console.error("Study application email error:", err);
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);

    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 },
    );
  }
}

// PATCH: Update documents belonging to the authenticated user's application
export async function PATCH(req: Request) {
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

    const supabase = await createClient(true);
    const body = await req.json();

    if (!body.applicationId) {
      return NextResponse.json(
        { error: "Application ID is required." },
        { status: 400 },
      );
    }

    if (
      !body.documents ||
      typeof body.documents !== "object" ||
      Array.isArray(body.documents)
    ) {
      return NextResponse.json(
        { error: "Valid documents are required." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("study_applications")
      .update({
        documents: body.documents,
      })
      .eq("id", body.applicationId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("PATCH error:", error);

      return NextResponse.json(
        { error: "Application not found or access denied." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("PATCH catch error:", error);

    return NextResponse.json(
      { error: "Failed to update documents" },
      { status: 500 },
    );
  }
}
