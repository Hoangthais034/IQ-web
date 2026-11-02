import "server-only";

import { SignJWT } from "jose";

import { auth } from "@/auth";

const API_URL = process.env.API_INTERNAL_URL ?? "http://localhost:38721";
const secret = new TextEncoder().encode(process.env.API_JWT_SECRET ?? "change-me");

async function apiToken(): Promise<string | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  return new SignJWT({ name: session.user?.name, picture: session.user?.image })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setAudience("iq-api")
    .setIssuedAt()
    .setExpirationTime("2m")
    .sign(secret);
}

/** Server-side fetch to the FastAPI service, signed as the logged-in user (if any). */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = await apiToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return fetch(`${API_URL}${path}`, { ...init, headers, cache: "no-store" });
}
