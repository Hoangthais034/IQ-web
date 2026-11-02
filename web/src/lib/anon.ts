export const ANON_COOKIE = "anon_id";
export const ANON_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const anonCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ANON_MAX_AGE,
};
