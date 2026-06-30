import { getStoreSettings } from "@/app/_lib/settings";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const settings = await getStoreSettings();

  if (!settings) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }

  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const supabase = await createClient(true);

  const { data, error } = await supabase
    .from("storeSettings")
    .update({
      storeName: body.storeName,
      storeEmail: body.storeEmail,
      storePhone: body.storePhone,
      storeAddress: body.storeAddress,
      websiteUrl: body.websiteUrl,
      description: body.description,
      whatsapp: body.whatsapp,
      instagram: body.instagram,
      facebook: body.facebook,
      twitter: body.twitter,
      tiktok: body.tiktok,
      youtube: body.youtube,
      exchangeBankName: body.exchangeBankName,
      exchangeBankAccountName: body.exchangeBankAccountName,
      exchangeBankAccountNumber: body.exchangeBankAccountNumber,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}
