import Link from "next/link";

import { Icon, type IconName } from "@/components/icons";

type Variant = "primary" | "outline" | "soft" | "light";

export const buttonClass = (variant: Variant = "primary") => `btn btn-${variant}`;

export function ButtonLink({
  href, children, variant = "primary", className = "",
}: { href: string; children: React.ReactNode; variant?: Variant; className?: string }) {
  return <Link href={href} className={`${buttonClass(variant)} ${className}`}>{children}</Link>;
}

export function Chip({ icon, children, tone = "neutral" }: { icon?: IconName; children: React.ReactNode; tone?: "neutral" | "brand" | "sun" | "teal" }) {
  const t = { neutral: "bg-sunken text-muted border border-line", brand: "bg-brand-soft text-brand-800", sun: "bg-sun-soft text-sun-ink", teal: "bg-teal-soft text-teal-700" }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${t}`}>
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card p-5 ${className}`}>{children}</div>;
}

export function SectionHeader({ eyebrow, title, subtitle, center = false }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-800">{eyebrow}</p>}
      <h2 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
    </div>
  );
}

export function IconTile({ name, tone = "brand" }: { name: IconName; tone?: "brand" | "teal" | "sun" }) {
  const t = { brand: "bg-brand-soft text-brand-800", teal: "bg-teal-soft text-teal-700", sun: "bg-sun-soft text-sun-ink" }[tone];
  return <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${t}`}><Icon name={name} className="h-6 w-6" /></span>;
}

export function Callout({ title, children, tone = "info", icon = "bulb" }: { title?: string; children: React.ReactNode; tone?: "info" | "tip" | "warn"; icon?: IconName }) {
  const t = {
    info: "border-brand/40 bg-brand-soft text-ink",
    tip: "border-teal/50 bg-teal-soft text-ink",
    warn: "border-sun bg-sun-soft text-ink",
  }[tone];
  return (
    <div className={`flex gap-3 rounded-2xl border p-4 ${t}`}>
      <Icon name={icon} className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="space-y-1 text-sm leading-relaxed">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-muted">{children}</div>
      </div>
    </div>
  );
}

/** Numbered vertical steps joined by a line. */
export function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="space-y-0">
      {items.map((s, i) => (
        <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
          {i < items.length - 1 && <span className="absolute left-4 top-9 h-[calc(100%-2.25rem)] w-px bg-line" aria-hidden="true" />}
          <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">{i + 1}</span>
          <div className="pt-0.5 text-muted">{s}</div>
        </li>
      ))}
    </ol>
  );
}

export function Faq({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  return (
    <div className="divide-y divide-line card overflow-hidden">
      {items.map((it) => (
        <details key={it.q} className="group p-5">
          <summary className="-m-2 flex items-center justify-between gap-4 rounded-lg p-2 font-semibold text-ink transition-colors hover:bg-brand-soft">
            {it.q}
            <span className="text-brand-800 transition-transform group-open:rotate-45" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            </span>
          </summary>
          <div className="mt-3 text-muted">{it.a}</div>
        </details>
      ))}
    </div>
  );
}

export function PageShell({ children, width = "max-w-5xl" }: { children: React.ReactNode; width?: string }) {
  return <main className={`mx-auto w-full ${width} px-4 py-10 sm:py-14`}>{children}</main>;
}
