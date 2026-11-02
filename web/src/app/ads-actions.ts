"use server";

import { apiFetch } from "@/lib/api";

export async function markPopunderSeen() {
  await apiFetch("/me/popunder-seen", { method: "POST" });
}
