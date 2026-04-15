import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";
import { sendApiKeyRotationEmail } from "@/app/_lib/email";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.userRole !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Await the client creation
  const supabase = await createClient();

  // Generate new key
  const newKey = `sk_live_${crypto.randomUUID().replace(/-/g, "")}`;
  const maskedKey = `${newKey.slice(0, 8)}••••••••${newKey.slice(-4)}`;

  // Update in database
  const { error } = await supabase
    .from("api_keys")
    .update({
      key: newKey,
      masked_key: maskedKey,
      created_at: new Date().toISOString(),
      updated_by: session.user.id,
    })
    .eq("type", "stripe");

  if (error) {
    return NextResponse.json(
      { message: "Failed to rotate key" },
      { status: 500 },
    );
  }

  // Send new key to admin email
  await sendApiKeyRotationEmail({
    to: session.user.email!,
    newKey: newKey,
    maskedKey: maskedKey,
    adminName: session.user.firstName || session.user.email!,
  });

  return NextResponse.json({ success: true });
}
