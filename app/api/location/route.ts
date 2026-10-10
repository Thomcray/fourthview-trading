import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
  const raw =
    req.headers.get("x-vercel-ip-country") ??
    (process.env.NODE_ENV === "development"
      ? (process.env.DEV_COUNTRY ?? null)
      : null);

  const country = raw && !["XX", "T1"].includes(raw) ? raw : null;

  return NextResponse.json(
    { country_code: country },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
