import { NextResponse } from "next/server";
import { createClient } from "@/app/_lib/supabase-server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";

// Define Category type
type Category = {
  id: number;
  name: string;
};

export async function GET(request: Request) {
  try {
    const supabase = await createClient(true);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query = supabase.from("products").select("*", { count: "exact" });

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (cursor) {
      query = query.lt("id", parseInt(cursor));
    }

    query = query.order("id", { ascending: false }).limit(limit + 1);

    const { data: products, error, count } = await query;

    if (error) throw error;

    const hasMore = products && products.length > limit;
    const items = hasMore ? products.slice(0, -1) : products;
    const nextCursor =
      hasMore && items.length > 0 ? items[items.length - 1]?.id : null;

    const categoryIds = [...new Set(items?.map((p) => p.categoryId) || [])];
    let categories: Category[] = [];

    if (categoryIds.length > 0) {
      const { data: cats, error: catError } = await supabase
        .from("categories")
        .select("id, name")
        .in("id", categoryIds);

      if (!catError && cats) {
        categories = cats as Category[];
      }
    }

    const productsWithCategory =
      items?.map((product) => ({
        ...product,
        categoryName:
          categories.find((c) => c.id === product.categoryId)?.name ||
          "Unknown",
      })) || [];

    return NextResponse.json({
      products: productsWithCategory,
      nextCursor,
      total: count || 0,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
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
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient(true);

    // Fetch image paths before deleting so we can clean up storage
    const { data: product } = await supabase
      .from("products")
      .select("imageUrl")
      .eq("id", id)
      .single();

    // Delete product from DB
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Clean up images from storage
    if (product?.imageUrl?.length) {
      const paths = product.imageUrl
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
          // Log but don't fail — product is already deleted
          console.error("Storage cleanup error:", storageError);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
