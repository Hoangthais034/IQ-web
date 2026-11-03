import Link from "next/link";
import { notFound } from "next/navigation";

import { startAttempt } from "@/app/test/actions";
import { AdSlot } from "@/components/ads";
import { Icon, TypeIcon, TypeIllustration } from "@/components/icons";
import { Callout, Card, Chip, PageShell, Steps } from "@/components/ui";
import { TIPS, tipBySlug } from "@/content/tips";
import { TYPE_META, typeForTipSlug } from "@/content/types";

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
  const type = typeForTipSlug(tip.slug);
  const meta = type ? TYPE_META[type] : null;
  return (
    <PageShell width="max-w-3xl">
      <div className="space-y-8">
        <header className="space-y-4">
          <Link href="/meo" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-800 hover:underline">
            <Icon name="arrow" className="h-4 w-4 rotate-180" /> Tất cả mẹo
          </Link>
          <div className="flex items-start gap-4">
            {type && <TypeIcon type={type} size="lg" />}
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-ink">{tip.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Chip icon="book" tone="brand">{tip.rules.length} quy luật</Chip>
                <Chip icon="list">{tip.steps.length} bước giải</Chip>
              </div>
            </div>
          </div>
          <p className="text-lg text-muted">{tip.intro}</p>
          {type && meta && <div className={`rounded-2xl ${meta.tint} px-4 py-3`}><TypeIllustration type={type} className="mx-auto h-24 w-full max-w-xs" /></div>}
        </header>

        <AdSlot />

        <Callout tone="info" icon="eye" title="Nhận ra dạng đề">
          <ul className="list-disc space-y-1 pl-5">{tip.recognize.map((r) => <li key={r}>{r}</li>)}</ul>
        </Callout>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-ink">Quy luật hay gặp</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {tip.rules.map((r, i) => (
              <Card key={r.name} className="space-y-1">
                <p className="flex items-center gap-2 font-bold text-ink">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand-800">{i + 1}</span>
                  {r.name}
                </p>
                <p className="text-sm text-muted">{r.detail}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-ink">Cách giải từng bước</h2>
          <Card><Steps items={tip.steps} /></Card>
        </section>

        <section className="rounded-2xl border border-sun bg-sun-soft p-5">
          <h2 className="mb-2 flex items-center gap-2 font-bold text-sun-ink"><Icon name="bulb" className="h-5 w-5" /> Ví dụ</h2>
          <p className="font-semibold text-ink">{tip.example.question}</p>
          <p className="mt-2 text-ink">Đáp án: <strong className="rounded-md bg-white px-2 py-0.5">{tip.example.answer}</strong></p>
          <p className="mt-2 text-sm text-ink">{tip.example.why}</p>
        </section>

        {tip.practiceType && (
          <form action={startAttempt.bind(null, "practice", tip.practiceType)}>
            <button className="btn btn-primary w-full sm:w-auto"><Icon name="play" className="h-5 w-5" /> Luyện 10 câu dạng này</button>
          </form>
        )}

        <AdSlot />
      </div>
    </PageShell>
  );
}
