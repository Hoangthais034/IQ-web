import { NextResponse, type NextRequest } from "next/server";

import { ANON_COOKIE, anonCookieOptions } from "@/lib/anon";

// Give every visitor an anon_id so attempts made before login can be claimed later.
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (!req.cookies.get(ANON_COOKIE)) {
    res.cookies.set(ANON_COOKIE, crypto.randomUUID(), anonCookieOptions);
  }
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
