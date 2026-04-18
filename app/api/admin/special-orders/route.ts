import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient(true);

  const { data, error } = await supabase
    .from("specialOrders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Sign all image URLs fresh (1 hour expiry)
  const ordersWithSignedUrls = await Promise.all(
    data.map(async (order) => {
      if (!order.images?.length) return order;

      const signedImages = await Promise.all(
        order.images.map(async (path: string) => {
          // Already a full URL (old data) — return as-is
          if (path.startsWith("http")) return path;

          const { data } = await supabase.storage
            .from("product-images")
            .createSignedUrl(path, 60 * 60); // 1 hour

          return data?.signedUrl ?? "";
        }),
      );

      return { ...order, images: signedImages };
    }),
  );

  return NextResponse.json({ specialOrders: ordersWithSignedUrls });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json(
      { error: "Missing id or status" },
      { status: 400 },
    );
  }

  const supabase = await createClient(true);

  const { data, error } = await supabase
    .from("specialOrders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ specialOrder: data });
}
