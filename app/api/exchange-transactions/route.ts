import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const supabase = await createClient(true);

  const receiptFile = formData.get("receipt") as File | null;
  if (!receiptFile) {
    return NextResponse.json({ error: "Receipt is required" }, { status: 400 });
  }

  const uploadFile = async (file: File, prefix: string) => {
    const ext = file.name.split(".").pop();
    const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("exchange-uploads")
      .upload(path, file);
    if (error) throw new Error(`Upload failed: ${error.message}`);
    return path;
  };

  try {
    const receiptUrl = await uploadFile(receiptFile, "receipts");

    const userQrFile = formData.get("userQr") as File | null;
    const userQrUrl = userQrFile
      ? await uploadFile(userQrFile, "qr-codes")
      : null;

    const { data, error } = await supabase
      .from("exchangeTransactions")
      .insert({
        fromCurrency: formData.get("fromCurrency"),
        toCurrency: formData.get("toCurrency"),
        rate: Number(formData.get("rate")),
        sendAmount: Number(formData.get("sendAmount")),
        receiveAmount: Number(formData.get("receiveAmount")),
        receiptUrl,
        userQrUrl,
        userBankName: formData.get("userBankName") || null,
        userAccountName: formData.get("userAccountName") || null,
        userAccountNumber: formData.get("userAccountNumber") || null,
        userWalletAddress: formData.get("userWalletAddress") || null,
        narration: formData.get("narration") || null,
        whatsapp: formData.get("whatsapp"),
        email: formData.get("email"),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ transaction: data });
  } catch (err) {
    console.error("Exchange transaction error:", err);
    return NextResponse.json(
      { error: "Failed to submit transaction" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient(true);
  const { data, error } = await supabase
    .from("exchangeTransactions")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ transactions: data });
}
