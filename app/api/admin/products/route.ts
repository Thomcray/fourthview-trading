import { NextResponse } from "next/server";
import { createClient } from "@/app/_lib/supabase-server";

// Define Category type
type Category = {
  id: number;
  name: string;
};

export async function GET(request: Request) {
  try {
    const supabase = await createClient(); // public data - no auth needed

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query = supabase.from("products").select("*", { count: "exact" });

    // Apply search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply cursor-based pagination
    if (cursor) {
      query = query.lt("id", parseInt(cursor));
    }

    // Order by ID descending (newest first)
    query = query.order("id", { ascending: false }).limit(limit + 1);

    const { data: products, error, count } = await query;

    if (error) throw error;

    // Check if there are more items
    const hasMore = products && products.length > limit;
    const items = hasMore ? products.slice(0, -1) : products;
    const nextCursor =
      hasMore && items.length > 0 ? items[items.length - 1]?.id : null;

    // Fetch categories for product names
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

    // Map category names to products
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
