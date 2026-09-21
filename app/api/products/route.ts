import { NextResponse } from "next/server";
import { getProductsPage } from "@/app/_lib/products-query";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const modeParam = searchParams.get("mode");
    const mode =
      modeParam === "target" || modeParam === "productType" ? modeParam : null;

    const cursorParam = searchParams.get("cursor");
    const cursor = cursorParam ? parseInt(cursorParam) : null;

    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "12") || 12, 1),
      50,
    );

    const result = await getProductsPage({
      mode,
      value: searchParams.get("value")?.trim().toLowerCase() || "",
      sort: searchParams.get("sort") || "default",
      cursor: Number.isNaN(cursor) ? null : cursor,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
