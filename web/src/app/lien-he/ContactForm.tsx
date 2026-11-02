"use client";

import { useActionState } from "react";

import { sendContact, type ContactState } from "./actions";

const TOPICS = [
  ["gop_y", "Góp ý"],
  ["bao_loi", "Báo lỗi câu hỏi"],
  ["thanh_toan", "Thanh toán / gói tháng"],
  ["du_lieu", "Dữ liệu cá nhân (xem, sửa, xóa)"],
  ["khac", "Khác"],
] as const;

const input = "w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

export function ContactForm({ name, email, topic }: { name?: string; email?: string; topic?: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, null);
  if (state?.ok) {
    return (
      <p className="rounded-lg bg-green-50 p-4 text-green-800">
        Đã gửi. Cảm ơn bạn, chúng tôi sẽ trả lời qua email trong vài ngày tới.
      </p>
    );
  }
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Tên</span>
          <input name="name" required maxLength={100} defaultValue={name} className={input} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input name="email" type="email" required maxLength={320} defaultValue={email} className={input} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Chủ đề</span>
        <select name="topic" defaultValue={topic ?? "gop_y"} className={input}>
          {TOPICS.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Nội dung</span>
        <textarea name="message" required minLength={10} maxLength={4000} rows={6} className={input}
          placeholder="Nếu báo lỗi câu hỏi hoặc thanh toán, ghi kèm mã bài làm hoặc mã chuyển khoản giúp mình nhé." />
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending} className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white disabled:opacity-60">
        {pending ? "Đang gửi..." : "Gửi"}
      </button>
    </form>
  );
}
