import Link from "next/link";

import { Icon, TypeIcon } from "@/components/icons";
import { Callout, PageShell, SectionHeader } from "@/components/ui";
import { TIPS } from "@/content/tips";
import { TYPE_META, typeForTipSlug } from "@/content/types";

export const metadata = { title: "Mẹo làm bài test IQ" };

const GENERAL = [
  { icon: "clock" as const, t: "Quản lý thời gian", d: "40 câu trong 35 phút là khoảng 50 giây mỗi câu. Quá 1 phút thì bỏ qua, quay lại sau." },
  { icon: "target" as const, t: "Dễ trước, khó sau", d: "Câu dễ ở đầu, câu khó ở cuối. Đừng để mất điểm câu dễ vì vội." },
  { icon: "eye" as const, t: "Loại trừ đáp án", d: "Không chắc thì loại đáp án sai trước rồi mới chọn." },
  { icon: "check" as const, t: "Đừng bỏ trống", d: "Không bị trừ điểm khi sai, nên đừng để trống câu nào." },
];

export default function TipsIndex() {
  return (
    <PageShell>
      <SectionHeader eyebrow="Mẹo làm bài" title="Học cách nhận ra quy luật nhanh hơn" subtitle="Chọn một dạng đề để xem cách nhận ra, các quy luật hay gặp và cách giải từng bước." />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TIPS.map((t) => {
          const type = typeForTipSlug(t.slug);
          return (
            <li key={t.slug}>
              <Link href={`/meo/${t.slug}`} className="card card-link block h-full space-y-3 p-5">
                {type && <TypeIcon type={type} />}
                <h2 className="font-bold text-ink">{type ? TYPE_META[type].label : t.title}</h2>
                <p className="text-sm text-muted">{t.intro}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-800">Xem mẹo <Icon name="arrow" className="h-4 w-4" /></span>
              </Link>
            </li>
          );
        })}
      </ul>
      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-bold text-ink">Mẹo chung cho cả bài</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {GENERAL.map((g) => (
            <Callout key={g.t} icon={g.icon} title={g.t} tone="tip">{g.d}</Callout>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
