import "server-only";

import { SignJWT } from "jose";
import { cookies, headers as requestHeaders } from "next/headers";

import { auth } from "@/auth";
import { ANON_COOKIE } from "@/lib/anon";

const API_URL = process.env.API_INTERNAL_URL ?? "http://localhost:38721";
const rawSecret = process.env.API_JWT_SECRET || (process.env.NODE_ENV === "production" ? "" : "change-me");
const secret = new TextEncoder().encode(rawSecret);

async function apiToken(): Promise<string | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  if (!rawSecret) throw new Error("API_JWT_SECRET is required in production");
  return new SignJWT({ name: session.user?.name, picture: session.user?.image })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setAudience("iq-api")
    .setIssuedAt()
    .setExpirationTime("2m")
    .sign(secret);
}

/** Server-side fetch to the FastAPI service, signed as the logged-in user and tagged with the anon_id cookie. */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = await apiToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const anon = (await cookies()).get(ANON_COOKIE)?.value;
  if (anon && !headers.has("X-Anon-Id")) headers.set("X-Anon-Id", anon);
  // Traefik sets X-Real-Ip from the TCP peer; the API uses it for rate limits.
  const h = await requestHeaders();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",").pop()?.trim();
  if (ip) headers.set("X-Client-Ip", ip);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return fetch(`${API_URL}${path}`, { ...init, headers, cache: "no-store" });
}

export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<{ status: number; data: T | null }> {
  const res = await apiFetch(path, init);
  const data = res.ok && res.status !== 204 ? ((await res.json()) as T) : null;
  return { status: res.status, data };
}
