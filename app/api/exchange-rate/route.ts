import { NextResponse } from "next/server";
import { createClient } from "@/app/_lib/supabase-server";

const EXTERNAL_API = "https://open.er-api.com/v6/latest/CNY";
const CACHE_TTL_MINUTES = 60; // 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.has("force");

  try {
    const supabase = await createClient(true);

    // Check Supabase cache
    if (!force) {
      const { data: cached } = await supabase
        .from("ExchangeRateCache")
        .select("*")
        .order("fetchedAt", { ascending: false })
        .limit(1)
        .single();

      if (cached) {
        const ageMs = Date.now() - new Date(cached.fetchedAt).getTime();
        if (ageMs < CACHE_TTL_MINUTES * 60 * 1000) {
          return NextResponse.json(cached.rates);
        }
      }
    }

    // Fetch fresh from your existing API
    const res = await fetch(EXTERNAL_API, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`API returned ${res.status}`);

    const data = await res.json();

    const requiredRates = ["NGN", "GHS", "USD", "EUR", "GBP", "CAD", "AUD"];
    const missing = requiredRates.filter((rate) => !data.rates[rate]);
    if (missing.length > 0)
      throw new Error(`Missing rates: ${missing.join(", ")}`);

    const rates = {
      NGN: data.rates.NGN,
      GHS: data.rates.GHS,
      USD: data.rates.USD,
      EUR: data.rates.EUR,
      GBP: data.rates.GBP,
      CAD: data.rates.CAD,
      AUD: data.rates.AUD,
      CNY: 1,
    };

    // Save to Supabase cache
    await supabase.from("ExchangeRateCache").insert({ base: "CNY", rates });

    return NextResponse.json(rates);
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);

    // Fallback to Supabase stale cache
    const supabase = await createClient(true);
    const { data: fallback } = await supabase
      .from("ExchangeRateCache")
      .select("rates")
      .order("fetchedAt", { ascending: false })
      .limit(1)
      .single();

    if (fallback) {
      return NextResponse.json(fallback.rates);
    }

    return NextResponse.json(
      { error: "Exchange rates temporarily unavailable" },
      { status: 503 },
    );
  }
}
