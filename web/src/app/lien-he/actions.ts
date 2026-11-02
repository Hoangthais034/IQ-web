"use server";

import { apiFetch } from "@/lib/api";

export type ContactState = { ok: boolean; error?: string } | null;

export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot: real users never fill this hidden field.
  if (String(form.get("website") ?? "")) return { ok: true };
  const body = {
    name: String(form.get("name") ?? "").trim(),
    email: String(form.get("email") ?? "").trim(),
    topic: String(form.get("topic") ?? "khac"),
    message: String(form.get("message") ?? "").trim(),
  };
  if (!body.name || !body.email) return { ok: false, error: "Vui lòng nhập tên và email." };
  if (body.message.length < 10) return { ok: false, error: "Nội dung cần ít nhất 10 ký tự." };
  let res: Response;
  try {
    res = await apiFetch("/contact", { method: "POST", body: JSON.stringify(body) });
  } catch {
    return { ok: false, error: "Không gửi được, bạn thử lại sau nhé." };
  }
  if (res.ok) return { ok: true };
  if (res.status === 429) return { ok: false, error: "Bạn gửi hơi nhiều, thử lại sau 1 giờ nhé." };
  if (res.status === 422) return { ok: false, error: "Email chưa đúng định dạng hoặc nội dung quá dài." };
  return { ok: false, error: "Không gửi được, bạn thử lại sau nhé." };
}
