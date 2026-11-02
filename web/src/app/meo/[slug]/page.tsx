import Link from "next/link";
import { notFound } from "next/navigation";

import { startAttempt } from "@/app/test/actions";
import { AdSlot } from "@/components/ads";
import { TIPS, tipBySlug } from "@/content/tips";

export function generateStaticParams() {
  return TIPS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const tip = tipBySlug((await params).slug);
  return tip ? { title: tip.title, description: tip.intro } : {};
}

export default async function TipPage({ params }: { params: Promise<{ slug: string }> }) {
  const tip = tipBySlug((await params).slug);
  if (!tip) notFound();
  return (
    <main className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <header>
        <Link href="/meo" className="text-sm text-neutral-500 underline">Tất cả mẹo</Link>
        <h1 className="mt-2 text-3xl font-bold">{tip.title}</h1>
        <p className="mt-3 text-neutral-700">{tip.intro}</p>
      </header>

      <AdSlot kind="banner" />

      <section>
        <h2 className="mb-2 text-xl font-semibold">Nhận ra dạng đề</h2>
        <ul className="list-disc space-y-1 pl-5">{tip.recognize.map((r) => <li key={r}>{r}</li>)}</ul>
      </section>
      <section>
        <h2 className="mb-2 text-xl font-semibold">Quy luật hay gặp</h2>
        <dl className="space-y-2">
          {tip.rules.map((r) => (
            <div key={r.name}>
              <dt className="font-medium">{r.name}</dt>
              <dd className="text-neutral-700">{r.detail}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section>
        <h2 className="mb-2 text-xl font-semibold">Cách giải từng bước</h2>
        <ol className="list-decimal space-y-1 pl-5">{tip.steps.map((s) => <li key={s}>{s}</li>)}</ol>
      </section>
      <section className="rounded-lg bg-neutral-50 p-4">
        <h2 className="mb-2 font-semibold">Ví dụ</h2>
        <p>{tip.example.question}</p>
        <p className="mt-1">Đáp án: <strong>{tip.example.answer}</strong></p>
        <p className="mt-1 text-neutral-700">{tip.example.why}</p>
      </section>

      {tip.practiceType && (
        <form action={startAttempt.bind(null, "practice", tip.practiceType)}>
          <button className="rounded-lg bg-neutral-900 px-5 py-3 font-medium text-white">Luyện 10 câu dạng này</button>
        </form>
      )}

      <AdSlot kind="native" />
    </main>
  );
}
