import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { NextResponse } from "next/server";
import { getStudyDocumentMaxSize } from "@/app/_lib/study-document-limits";

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

    const { applicationId, docType, fileName } = await req.json();

    if (!applicationId || !docType || !fileName) {
      return NextResponse.json(
        { error: "applicationId, docType and fileName are required" },
        { status: 400 },
      );
    }

    const maxSizeMB = getStudyDocumentMaxSize(docType);

    if (!maxSizeMB) {
      return NextResponse.json(
        { error: "Invalid document type" },
        { status: 400 },
      );
    }

    const supabase = await createClient(true);

    // Make sure this application belongs to the logged-in user.
    const { data: application, error: applicationError } = await supabase
      .from("study_applications")
      .select("id")
      .eq("id", applicationId)
      .eq("user_id", userId)
      .single();

    if (applicationError || !application) {
      return NextResponse.json(
        { error: "Application not found or access denied." },
        { status: 404 },
      );
    }

    const timestamp = Date.now();
    const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");

    const filePath = `applications/${applicationId}/${docType}_${timestamp}_${safeName}`;

    const { data, error } = await supabase.storage
      .from("study-documents")
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error("Signed URL error:", error);

      return NextResponse.json(
        { error: "Failed to create upload URL." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      filePath,
      maxSizeMB,
    });
  } catch (error) {
    console.error("Study document POST error:", error);

    return NextResponse.json(
      { error: "Failed to create upload URL" },
      { status: 500 },
    );
  }
}
