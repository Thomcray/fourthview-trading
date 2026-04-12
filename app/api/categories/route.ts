import { getCategories } from "@/app/_lib/data-services";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await getCategories();

  if (!categories) {
    return NextResponse.json({ categories: [] });
  }

  return NextResponse.json({ categories });
}
