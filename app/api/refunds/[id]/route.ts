import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { createClient } from "@/app/_lib/supabase-server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient(true);
    const { id } = await params;

    const { data: refund, error } = await supabase
      .from("refunds")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !refund) {
      return NextResponse.json({ error: "Refund not found" }, { status: 404 });
    }

    // Generate signed URLs for evidence files
    let signedEvidenceUrls: { name: string; url: string }[] = [];

    if (refund.evidence_urls && refund.evidence_urls.length > 0) {
      const signedUrls = await Promise.all(
        refund.evidence_urls.map(async (filePath: string) => {
          // Extract just the path from the full URL if needed
          const path = filePath.includes("/refund-evidence/")
            ? filePath.split("/refund-evidence/")[1]
            : filePath;

          const { data, error } = await supabase.storage
            .from("refund-evidence")
            .createSignedUrl(path, 60 * 60); // 1 hour expiry

          return {
            name: path.split("/").pop() ?? "evidence",
            url: error ? "" : (data?.signedUrl ?? ""),
          };
        }),
      );

      signedEvidenceUrls = signedUrls.filter((u) => u.url);
    }

    return NextResponse.json({
      refund: {
        ...refund,
        signedEvidenceUrls,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch refund" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient(true);
    const { id } = await params;
    const body = await req.json();
    const { action } = body; // "approve", "reject"

    const { data: refund, error: fetchError } = await supabase
      .from("refunds")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !refund) {
      return NextResponse.json({ error: "Refund not found" }, { status: 404 });
    }

    if (refund.status !== "pending") {
      return NextResponse.json(
        { error: "Refund has already been processed" },
        { status: 400 },
      );
    }

    if (action === "reject") {
      const { data, error } = await supabase
        .from("refunds")
        .update({
          status: "rejected",
          processed_at: new Date().toISOString(),
          processed_by: Number(session.user.id),
        })
        .eq("id", id)
        .select()
        .single();

      if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({ refund: data, message: "Refund rejected" });
    }

    if (action === "approve") {
      // Call Paystack refund API
      const paystackRes = await fetch("https://api.paystack.co/refund", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction: refund.transaction_reference,
          amount: refund.amount * 100, // Paystack uses kobo
        }),
      });

      const paystackData = await paystackRes.json();

      if (!paystackRes.ok || !paystackData.status) {
        return NextResponse.json(
          {
            error: paystackData.message || "Paystack refund failed",
          },
          { status: 500 },
        );
      }

      // Update refund status to completed
      const { data, error } = await supabase
        .from("refunds")
        .update({
          status: "completed",
          processed_at: new Date().toISOString(),
          processed_by: Number(session.user.id),
        })
        .eq("id", id)
        .select()
        .single();

      if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });

      // Update order status
      await supabase
        .from("orders")
        .update({ status: "refunded" })
        .eq("id", refund.order_id);

      return NextResponse.json({
        refund: data,
        message: "Refund processed successfully via Paystack",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Refund PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to process refund" },
      { status: 500 },
    );
  }
}
