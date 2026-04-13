//api / exchange - rate;
import { NextResponse } from "next/server";

let exchangeData: Record<string, number> | null = null;
let lastFetched = 0;
let fetchAttempts = 0;

export async function GET() {
  const now = Date.now();

  // Return cached data if still valid
  if (exchangeData && now - lastFetched < 3600000) {
    return NextResponse.json(exchangeData);
  }

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/CNY", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();

    // Validate required rates exist
    const requiredRates = ["NGN", "USD", "EUR", "GBP", "CAD", "AUD"];
    const missingRates = requiredRates.filter((rate) => !data.rates[rate]);

    if (missingRates.length > 0) {
      throw new Error(`Missing rates: ${missingRates.join(", ")}`);
    }

    exchangeData = {
      NGN: data.rates.NGN,
      USD: data.rates.USD,
      EUR: data.rates.EUR,
      GBP: data.rates.GBP,
      CAD: data.rates.CAD,
      AUD: data.rates.AUD,
      CNY: 1,
    };

    lastFetched = now;
    fetchAttempts = 0;

    return NextResponse.json(exchangeData);
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    fetchAttempts++;

    // Return 503 Service Unavailable instead of stale/incorrect data
    return NextResponse.json(
      {
        error: "Exchange rates temporarily unavailable",
        message: "Please try again later",
      },
      { status: 503 },
    );
  }
}
