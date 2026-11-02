import { NextResponse, type NextRequest } from "next/server";

import { ANON_COOKIE, anonCookieOptions } from "@/lib/anon";
import { apiFetch } from "@/lib/api";

// Auth.js redirects here after Google login (callbackUrl=/auth/after-login?next=...).
// Claims attempts made anonymously in this browser, then issues a fresh anon_id so a
// different account logging in later on the same browser cannot claim anything.
export async function GET(req: NextRequest) {
  const next = req.nextUrl.searchParams.get("next") ?? "/";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const anonId = req.cookies.get(ANON_COOKIE)?.value;

  if (anonId) {
    await apiFetch("/me/claim-anon", { method: "POST", body: JSON.stringify({ anon_id: anonId }) });
  }

  const res = NextResponse.redirect(new URL(safeNext, req.nextUrl.origin));
  res.cookies.set(ANON_COOKIE, crypto.randomUUID(), anonCookieOptions);
  return res;
}
