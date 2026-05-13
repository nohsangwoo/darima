import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim();

  return NextResponse.json(
    {
      enabled: Boolean(siteKey),
      siteKey: siteKey || "",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
