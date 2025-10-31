import { NextResponse } from "next/server";

let exchangeData: number | null = null;
let lastFetched = 0;

export async function GET() {
  const now = Date.now();

  // hit API call if exchangeData is null || after 1 hour
  if (!exchangeData || now - lastFetched > 3600000) {
    const res = await fetch("https://open.er-api.com/v6/latest/CNY");

    const data = await res.json();
    exchangeData = data.rates.NGN;

    lastFetched = now;
  }

  return NextResponse.json({ NGN: exchangeData });
}
