"use server";

import { revalidatePath } from "next/cache";

import { apiJson } from "@/lib/api";

export async function setQuestionStatus(id: string, status: "approved" | "rejected") {
  await apiJson(`/admin/questions/${id}/status`, { method: "POST", body: JSON.stringify({ status }) });
  revalidatePath("/admin");
}

export async function resolveTransaction(id: string, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const { status } = await apiJson(`/admin/transactions/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify({ email: email || null }),
  });
  if (status === 404 && email) throw new Error("Không tìm thấy người dùng với email này (họ cần đăng nhập ít nhất một lần).");
  revalidatePath("/admin");
}
