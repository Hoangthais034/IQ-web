import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ads";
import { Icon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { Prose } from "@/components/Prose";
import { ButtonLink, Callout, Faq, PageShell } from "@/components/ui";
import { GUIDES, guideBySlug } from "@/content/guides";
import { tipBySlug } from "@/content/tips";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  return {
    title: g.title, description: g.description, alternates: { canonical: `/huong-dan/${g.slug}` },
    openGraph: { type: "article" as const, title: g.title, description: g.description, url: `/huong-dan/${g.slug}`, siteName: SITE_NAME, locale: "vi_VN", images: ["/og.png"], publishedTime: g.published, modifiedTime: g.updated },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = guideBySlug((await params).slug);
  if (!g) notFound();
  const url = `${SITE_URL}/huong-dan/${g.slug}`;
  // Rotate through the list so every guide gets links from a few others, not just the first three.
  const i = GUIDES.findIndex((x) => x.slug === g.slug);
  const others = [1, 2, 3].map((k) => GUIDES[(i + k) % GUIDES.length]);
  return (
    <PageShell>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [
        { "@type": "Article", headline: g.title, description: g.description, inLanguage: "vi", mainEntityOfPage: url, image: `${SITE_URL}/og.png`, datePublished: g.published, dateModified: g.updated, author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL }, publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } } },
        ...(g.faq ? [{ "@type": "FAQPage", mainEntity: g.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }] : []),
        { "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Hướng dẫn", item: `${SITE_URL}/huong-dan` },
          { "@type": "ListItem", position: 3, name: g.title, item: url },
        ] },
      ] }} />
      <div className="space-y-8">
        <header className="max-w-3xl space-y-4">
          <Link href="/huong-dan" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-800 hover:underline">
            <Icon name="arrow" className="h-4 w-4 rotate-180" /> Tất cả hướng dẫn
          </Link>
          <h1 className="text-3xl font-extrabold leading-tight text-ink">{g.title}</h1>
          <p className="text-sm text-muted">Cập nhật <time dateTime={g.updated}>{new Date(g.updated).toLocaleDateString("vi-VN")}</time></p>
          <p className="text-lg text-muted">{g.intro}</p>
        </header>
        <AdSlot />
        <Prose sections={g.sections} />
        {g.faq && (
          <section className="max-w-3xl space-y-4">
            <h2 className="text-xl font-bold text-ink">Câu hỏi thường gặp</h2>
            <Faq items={g.faq} />
          </section>
        )}
        <Callout tone="warn" icon="shield" title="Lưu ý">Kết quả trên web chỉ mang tính tham khảo, không phải bài test IQ chuẩn hóa.</Callout>
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-ink">Mẹo cho từng dạng đề</h2>
          <div className="flex flex-wrap gap-2">
            {g.related.map((s) => tipBySlug(s)).filter(Boolean).map((t) => (
              <Link key={t!.slug} href={`/meo/${t!.slug}`} className="btn btn-outline !min-h-9 !px-3 !py-1 text-sm">{t!.title}</Link>
            ))}
          </div>
        </section>
        <div className="flex flex-wrap gap-3"><ButtonLink href="/test">Làm bài test</ButtonLink><ButtonLink href="/practice" variant="outline">Luyện theo dạng</ButtonLink></div>
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-ink">Bài khác</h2>
          <ul className="grid gap-3 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}><Link href={`/huong-dan/${o.slug}`} className="card card-link block h-full p-4 text-sm font-semibold text-ink">{o.title}</Link></li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
