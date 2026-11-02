import { notFound } from "next/navigation";

import { apiJson } from "@/lib/api";
import { getMe } from "@/lib/me";
import { TYPE_LABELS, type QuestionType } from "@/lib/types";

import { resolveTransaction, setQuestionStatus } from "./actions";

export const metadata = { title: "Duyệt đề", robots: { index: false } };

type AdminQuestion = {
  id: string;
  type: QuestionType;
  difficulty: number;
  prompt: string;
  prompt_svg: string | null;
  options: { key: string; text?: string; svg?: string }[];
  answer_key: string;
  explanation: string;
  source: string;
};

type Unmatched = { id: string; amount_vnd: number; content: string; reason: string; received_at: string };

const REASON: Record<string, string> = {
  no_code: "Không có mã đơn",
  unknown_code: "Mã đơn không tồn tại",
  underpaid: "Chuyển thiếu tiền",
  already_paid: "Đơn đã thanh toán trước đó",
};

export default async function AdminPage() {
  const me = await getMe();
  if (!me?.is_admin) notFound();
  const [{ data }, { data: txs }] = await Promise.all([
    apiJson<AdminQuestion[]>("/admin/questions?status=pending&limit=50"),
    apiJson<Unmatched[]>("/admin/transactions/unmatched"),
  ]);
  const questions = data ?? [];
  const unmatched = txs ?? [];

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Giao dịch chưa khớp ({unmatched.length})</h1>
      {unmatched.length === 0 && <p className="text-neutral-600">Không có giao dịch nào cần xử lý.</p>}
      {unmatched.map((t) => (
        <article key={t.id} className="space-y-2 rounded-lg border p-4">
          <p className="text-sm">
            <b>{t.amount_vnd.toLocaleString("vi-VN")}đ</b> · {REASON[t.reason] ?? t.reason} ·{" "}
            {new Date(t.received_at).toLocaleString("vi-VN")}
          </p>
          <p className="font-mono text-sm text-neutral-700">{t.content}</p>
          <form action={resolveTransaction.bind(null, t.id)} className="flex flex-wrap gap-2">
            <input name="email" type="email" placeholder="Email người mua" className="flex-1 rounded border px-2 py-1.5 text-sm" />
            <button className="rounded bg-green-700 px-3 py-1.5 text-sm text-white">Kích hoạt gói</button>
          </form>
          <form action={resolveTransaction.bind(null, t.id)}>
            <button className="text-sm text-neutral-500 underline">Bỏ qua (không phải tiền mua gói)</button>
          </form>
        </article>
      ))}

      <h1 className="text-2xl font-bold">Duyệt đề ({questions.length} câu chờ)</h1>
      {questions.length === 0 && <p className="text-neutral-600">Không có câu nào đang chờ duyệt.</p>}
      {questions.map((q) => (
        <article key={q.id} className="space-y-3 rounded-lg border p-4">
          <p className="text-xs text-neutral-500">
            {TYPE_LABELS[q.type]} · độ khó {q.difficulty} · nguồn {q.source}
          </p>
          <p className="font-medium">{q.prompt}</p>
          {q.prompt_svg && <div className="w-48" dangerouslySetInnerHTML={{ __html: q.prompt_svg }} />}
          <ul className="grid grid-cols-2 gap-2">
            {q.options.map((o) => (
              <li
                key={o.key}
                className={`rounded border p-2 text-sm ${o.key === q.answer_key ? "border-green-600 bg-green-50" : ""}`}
              >
                <b>{o.key}.</b> {o.text}
                {o.svg && <span className="block w-16" dangerouslySetInnerHTML={{ __html: o.svg }} />}
              </li>
            ))}
          </ul>
          <p className="text-sm text-neutral-700">Giải thích: {q.explanation}</p>
          <div className="flex gap-2">
            <form action={setQuestionStatus.bind(null, q.id, "approved")}>
              <button className="rounded bg-green-700 px-3 py-1.5 text-sm text-white">Duyệt</button>
            </form>
            <form action={setQuestionStatus.bind(null, q.id, "rejected")}>
              <button className="rounded border px-3 py-1.5 text-sm">Loại</button>
            </form>
          </div>
        </article>
      ))}
    </main>
  );
}
