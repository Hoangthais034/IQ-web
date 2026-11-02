import { NextResponse, type NextRequest } from "next/server";

const API_URL = process.env.API_INTERNAL_URL ?? "http://localhost:38721";

// Public webhook URL for SePay; the API itself is not exposed, so forward as-is.
export async function POST(req: NextRequest) {
  const res = await fetch(`${API_URL}/webhooks/sepay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.get("authorization") ?? "",
    },
    body: await req.text(),
    cache: "no-store",
  });
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
