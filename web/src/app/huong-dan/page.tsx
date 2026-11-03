import Link from "next/link";

import { Icon } from "@/components/icons";
import { PageShell, SectionHeader } from "@/components/ui";
import { GUIDES } from "@/content/guides";

export const metadata = {
  title: "Hướng dẫn làm bài test IQ",
  description: "Các bài hướng dẫn về thang điểm IQ, cách chia thời gian, cách luyện tập và độ chính xác của test IQ online.",
  alternates: { canonical: "/huong-dan" },
};

export default function GuidesIndex() {
  return (
    <PageShell>
      <SectionHeader eyebrow="Hướng dẫn" title="Hiểu rõ bài test trước khi làm" subtitle="Những câu hỏi bạn hay thắc mắc, trả lời ngắn gọn và thẳng thắn." />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link href={`/huong-dan/${g.slug}`} className="card card-link block h-full space-y-2 p-5">
              <h2 className="font-bold text-ink">{g.title}</h2>
              <p className="text-sm text-muted">{g.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-800">Đọc bài <Icon name="arrow" className="h-4 w-4" /></span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
