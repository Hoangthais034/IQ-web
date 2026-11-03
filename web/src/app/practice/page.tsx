import { startAttempt } from "@/app/test/actions";
import { Icon, TypeIcon } from "@/components/icons";
import { Callout, PageShell, SectionHeader } from "@/components/ui";
import { TYPE_META, TYPE_ORDER } from "@/content/types";

export const metadata = { title: "Luyện theo dạng đề" };

export default function PracticePage() {
  return (
    <PageShell>
      <SectionHeader eyebrow="Luyện tập" title="Luyện theo dạng đề" subtitle="10 câu mỗi lượt, có giải thích ngay sau mỗi câu." />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TYPE_ORDER.map((t) => (
          <form key={t} action={startAttempt.bind(null, "practice", t)}>
            <button className="card card-link flex h-full w-full flex-col items-start gap-3 p-5 text-left">
              <TypeIcon type={t} />
              <span className="font-bold text-ink">{TYPE_META[t].label}</span>
              <span className="text-sm text-muted">{TYPE_META[t].blurb}</span>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-800">Bắt đầu 10 câu <Icon name="arrow" className="h-4 w-4" /></span>
            </button>
          </form>
        ))}
      </div>
      <div className="mt-8"><Callout tone="tip" icon="bulb" title="Chưa chắc cách giải?">Xem mục Mẹo của từng dạng trước khi luyện sẽ nhanh tiến bộ hơn.</Callout></div>
    </PageShell>
  );
}
