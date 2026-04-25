import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileName, contentType, orderId } = await req.json();

    const supabase = await createClient(true);
    const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `refund-evidence/${orderId}/${Date.now()}_${safeName}`;

    const { data, error } = await supabase.storage
      .from("refund-evidence") // reuse your existing bucket or create a new one
      .createSignedUploadUrl(filePath);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("refund-evidence").getPublicUrl(filePath);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      filePath,
      publicUrl,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
