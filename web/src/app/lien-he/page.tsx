import { getMe } from "@/lib/me";

import { ContactForm } from "./ContactForm";

export const metadata = { title: "Liên hệ", description: "Góp ý, báo lỗi câu hỏi hoặc hỏi về dữ liệu cá nhân.", alternates: { canonical: "/lien-he" } };

const TOPIC_KEYS = new Set(["gop_y", "bao_loi", "thanh_toan", "du_lieu", "khac"]);

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ chu_de?: string }> }) {
  const [me, sp] = await Promise.all([getMe(), searchParams]);
  const topic = sp.chu_de && TOPIC_KEYS.has(sp.chu_de) ? sp.chu_de : undefined;
  return (
    <main className="mx-auto max-w-5xl px-4 py-10"><div className="max-w-2xl">
      <h1 className="text-3xl font-bold">Liên hệ</h1>
      <p className="mt-2 text-muted">Góp ý, báo lỗi câu hỏi, hỏi về thanh toán hay dữ liệu cá nhân, cứ gửi ở đây.</p>
      <div className="mt-6">
        <ContactForm name={me?.name ?? undefined} email={me?.email} topic={topic} />
      </div>
    </div></main>
  );
}
