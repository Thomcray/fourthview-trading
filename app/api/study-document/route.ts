import { createClient } from "@/app/_lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { applicationId, docType, fileName } = await req.json();
    const supabase = await createClient(true);

    const timestamp = Date.now();
    const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `applications/${applicationId}/${docType}_${timestamp}_${safeName}`;

    const { data, error } = await supabase.storage
      .from("study-documents")
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error("Signed URL error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      filePath,
    });
  } catch (error) {
    console.error("Study document POST error:", error);
    return NextResponse.json(
      { error: "Failed to create upload URL" },
      { status: 500 },
    );
  }
}
