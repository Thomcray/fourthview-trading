import { NextResponse } from "next/server";

export const runtime = "edge"; // fast, globally distributed

export async function GET(req: Request) {
  try {
    // Prefer Vercel's built-in geo header (free, no rate limits)
    const country =
      req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry"); // Cloudflare fallback

    if (country) {
      return NextResponse.json({ country_code: country });
    }

    // Last resort: proxy to ipapi.co (only hits if neither header is present)
    const res = await fetch("https://ipapi.co/json/", {
      headers: { "User-Agent": "currency-detector/1.0" },
      // Cache for 1 hour — same IP shouldn't re-detect constantly
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`ipapi.co error: ${res.status}`);

    const data = await res.json();
    return NextResponse.json(
      { country_code: data.country_code ?? null },
      {
        headers: {
          // Cache at CDN edge for 1 hour
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    // Never let location detection break the app — return null gracefully
    return NextResponse.json({ country_code: null }, { status: 200 });
  }
}
