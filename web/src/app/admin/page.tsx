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

type ContactMsg = { id: string; name: string; email: string; topic: string; message: string; created_at: string; emailed_at: string | null };
const CONTACT_TOPIC: Record<string, string> = { gop_y: "Góp ý", bao_loi: "Báo lỗi câu hỏi", thanh_toan: "Thanh toán", du_lieu: "Dữ liệu cá nhân", khac: "Khác" };
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
  const [{ data }, { data: txs }, { data: msgs }] = await Promise.all([
    apiJson<AdminQuestion[]>("/admin/questions?status=pending&limit=50"),
    apiJson<Unmatched[]>("/admin/transactions/unmatched"),
    apiJson<ContactMsg[]>("/admin/contact-messages?limit=30"),
  ]);
  const messages = msgs ?? [];
  const questions = data ?? [];
  const unmatched = txs ?? [];

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Giao dịch chưa khớp ({unmatched.length})</h1>
      {unmatched.length === 0 && <p className="text-muted">Không có giao dịch nào cần xử lý.</p>}
      {unmatched.map((t) => (
        <article key={t.id} className="space-y-2 rounded-lg border p-4">
          <p className="text-sm">
            <b>{t.amount_vnd.toLocaleString("vi-VN")}đ</b> · {REASON[t.reason] ?? t.reason} ·{" "}
            {new Date(t.received_at).toLocaleString("vi-VN")}
          </p>
          <p className="font-mono text-sm text-muted">{t.content}</p>
          <form action={resolveTransaction.bind(null, t.id)} className="flex flex-wrap gap-2">
            <input name="email" type="email" placeholder="Email người mua" className="flex-1 rounded border px-2 py-1.5 text-sm" />
            <button className="btn btn-primary !min-h-9 !px-3 !py-1 text-sm">Kích hoạt gói</button>
          </form>
          <form action={resolveTransaction.bind(null, t.id)}>
            <button className="btn btn-soft !min-h-9 !py-1 text-sm">Bỏ qua (không phải tiền mua gói)</button>
          </form>
        </article>
      ))}

      <h1 className="text-2xl font-bold">Liên hệ gần đây ({messages.length})</h1>
      {messages.length === 0 && <p className="text-muted">Chưa có tin nhắn nào.</p>}
      {messages.map((m) => (
        <article key={m.id} className="space-y-1 rounded-lg border p-4">
          <p className="text-sm">
            <b>{m.name}</b> · <a href={`mailto:${m.email}`} className="text-blue-600 underline">{m.email}</a> ·{" "}
            {CONTACT_TOPIC[m.topic] ?? m.topic} · {new Date(m.created_at).toLocaleString("vi-VN")}
            {!m.emailed_at && <span className="ml-2 rounded bg-amber-100 px-1.5 text-xs text-amber-800">chưa gửi email</span>}
          </p>
          <p className="whitespace-pre-wrap text-sm text-muted">{m.message}</p>
        </article>
      ))}

      <h1 className="text-2xl font-bold">Duyệt đề ({questions.length} câu chờ)</h1>
      {questions.length === 0 && <p className="text-muted">Không có câu nào đang chờ duyệt.</p>}
      {questions.map((q) => (
        <article key={q.id} className="space-y-3 rounded-lg border p-4">
          <p className="text-xs text-subtle">
            {TYPE_LABELS[q.type]} · độ khó {q.difficulty} · nguồn {q.source}
          </p>
          <p className="font-medium">{q.prompt}</p>
          {q.prompt_svg && <div className="w-48" dangerouslySetInnerHTML={{ __html: q.prompt_svg }} />}
          <ul className="grid grid-cols-2 gap-2">
            {q.options.map((o) => (
              <li
                key={o.key}
                className={`rounded border p-2 text-sm ${o.key === q.answer_key ? "border-success bg-success-soft" : ""}`}
              >
                <b>{o.key}.</b> {o.text}
                {o.svg && <span className="block w-16" dangerouslySetInnerHTML={{ __html: o.svg }} />}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted">Giải thích: {q.explanation}</p>
          <div className="flex gap-2">
            <form action={setQuestionStatus.bind(null, q.id, "approved")}>
              <button className="btn btn-primary !min-h-9 !px-3 !py-1 text-sm">Duyệt</button>
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
