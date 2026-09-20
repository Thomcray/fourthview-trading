import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { sendStatusUpdateEmail } from "@/app/_lib/send-study-email";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    if (session.user.userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can delete applications
    if (session.user.userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = await createClient(true);
    const { id } = await params;

    const applicationId = Number(id);

    if (!Number.isInteger(applicationId)) {
      return NextResponse.json(
        { error: "Invalid application ID" },
        { status: 400 },
      );
    }

    // Get the application first so we know which files belong to it
    const { data: application, error: fetchError } = await supabase
      .from("study_applications")
      .select("id, documents")
      .eq("id", applicationId)
      .single();

    if (fetchError || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    // Extract storage paths from the documents JSON
    const documentPaths = application.documents
      ? Object.values(
          application.documents as Record<string, { path?: string }>,
        )
          .map((document) => document.path)
          .filter((path): path is string => Boolean(path))
      : [];

    // Delete documents from Supabase Storage
    if (documentPaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("study-documents")
        .remove(documentPaths);

      if (storageError) {
        console.error("Failed to delete application documents:", storageError);

        return NextResponse.json(
          {
            error: "Failed to delete application documents",
          },
          { status: 500 },
        );
      }
    }

    // Delete the application record
    const { error: deleteError } = await supabase
      .from("study_applications")
      .delete()
      .eq("id", applicationId);

    if (deleteError) {
      console.error("Failed to delete study application:", deleteError);

      return NextResponse.json(
        {
          error: "Failed to delete application",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application and documents deleted successfully",
    });
  } catch (error) {
    console.error("Delete study application error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete application",
      },
      { status: 500 },
    );
  }
}
