import type { Section } from "@/content/tip-articles";

/** Long-form sections: heading, paragraphs, then an optional bullet list. */
export function Prose({ sections }: { sections: Section[] }) {
  return (
    <div className="max-w-3xl space-y-8">
      {sections.map((s) => (
        <section key={s.h} className="space-y-3">
          <h2 className="text-xl font-bold text-ink">{s.h}</h2>
          {s.p?.map((t) => <p key={t} className="leading-relaxed text-muted">{t}</p>)}
          {s.list && (
            <ul className="list-disc space-y-2 pl-5 leading-relaxed text-muted marker:text-brand">
              {s.list.map((t) => <li key={t}>{t}</li>)}
            </ul>
          )}
          {s.after?.map((t) => <p key={t} className="leading-relaxed text-muted">{t}</p>)}
        </section>
      ))}
    </div>
  );
}
