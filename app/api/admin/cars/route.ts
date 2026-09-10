import { NextResponse } from "next/server";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";

export async function GET(request: Request) {
  try {
    const supabase = await createClient(true);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query = supabase.from("cars").select("*", { count: "exact" });

    if (search) {
      query = query.ilike("brandName", `%${search}%`);
    }

    if (cursor) {
      query = query.lt("id", parseInt(cursor));
    }

    query = query.order("id", { ascending: false }).limit(limit + 1);

    const { data: cars, error, count } = await query;

    if (error) throw error;

    const hasMore = cars && cars.length > limit;
    const items = hasMore ? cars.slice(0, -1) : cars;
    const nextCursor =
      hasMore && items.length > 0 ? items[items.length - 1]?.id : null;

    return NextResponse.json({
      cars: items || [],
      nextCursor,
      total: count || 0,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Car ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient(true);

    // Fetch image paths before deleting so we can clean up storage
    const { data: car } = await supabase
      .from("cars")
      .select("imageUrl")
      .eq("id", id)
      .single();

    // Delete car from DB
    const { error } = await supabase.from("cars").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Clean up images from storage
    if (car?.imageUrl?.length) {
      const paths = car.imageUrl
        .map((url: string) => {
          // Handle both plain filenames and old full signed URLs
          if (url.startsWith("http")) {
            const urlObj = new URL(url);
            return urlObj.pathname.split("product-images/")[1]?.split("?")[0];
          }
          return url;
        })
        .filter(Boolean);

      if (paths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("product-images")
          .remove(paths);

        if (storageError) {
          // Log but don't fail — car is already deleted
          console.error("Storage cleanup error:", storageError);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete car",
      },
      { status: 500 },
    );
  }
}
