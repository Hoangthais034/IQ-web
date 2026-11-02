"use server";

import { revalidatePath } from "next/cache";

import { apiJson } from "@/lib/api";

export async function setQuestionStatus(id: string, status: "approved" | "rejected") {
  await apiJson(`/admin/questions/${id}/status`, { method: "POST", body: JSON.stringify({ status }) });
  revalidatePath("/admin");
}
