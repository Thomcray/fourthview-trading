import { getCountries } from "@/app/_lib/data-services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const countries = await getCountries();

    if (!countries) {
      return NextResponse.json(
        { error: "Failed to fetch countries" },
        { status: 500 },
      );
    }

    return NextResponse.json({ countries });
  } catch (error) {
    console.error("Error in countries API:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 },
    );
  }
}
