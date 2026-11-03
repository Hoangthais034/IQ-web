import { NextResponse, type NextRequest } from "next/server";

import { ANON_COOKIE, anonCookieOptions } from "@/lib/anon";
import { apiFetch } from "@/lib/api";

// Auth.js redirects here after Google login (callbackUrl=/auth/after-login?next=...).
// Claims attempts made anonymously in this browser, then issues a fresh anon_id so a
// different account logging in later on the same browser cannot claim anything.
export async function GET(req: NextRequest) {
  // Behind Traefik, Next's standalone server reports its bind address (https://0.0.0.0:3000) as
  // req.nextUrl.origin, so redirects must be built from the public site URL instead.
  const origin = process.env.NEXT_PUBLIC_SITE_URL || process.env.AUTH_URL || req.nextUrl.origin;
  const next = req.nextUrl.searchParams.get("next") ?? "/";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const anonId = req.cookies.get(ANON_COOKIE)?.value;

  if (anonId) {
    await apiFetch("/me/claim-anon", { method: "POST", body: JSON.stringify({ anon_id: anonId }) });
  }

  const res = NextResponse.redirect(new URL(safeNext, origin));
  res.cookies.set(ANON_COOKIE, crypto.randomUUID(), anonCookieOptions);
  return res;
}
