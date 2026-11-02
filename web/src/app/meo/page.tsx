import Link from "next/link";

import { TIPS } from "@/content/tips";

export const metadata = { title: "Mẹo làm bài test IQ" };

export default function TipsIndex() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Mẹo làm bài test IQ</h1>
      <section className="rounded-lg bg-neutral-50 p-4">
        <h2 className="mb-2 font-semibold">Mẹo chung</h2>
        <ul className="list-disc space-y-1 pl-5 text-neutral-700">
          <li>40 câu trong 35 phút là khoảng 50 giây mỗi câu. Quá 1 phút thì bỏ qua, quay lại sau.</li>
          <li>Câu dễ ở đầu, câu khó ở cuối. Đừng để mất điểm câu dễ vì vội.</li>
          <li>Không chắc thì loại trừ đáp án sai trước rồi mới chọn.</li>
          <li>Không bị trừ điểm khi sai, nên đừng để trống câu nào.</li>
        </ul>
      </section>
      <ul className="grid gap-3 sm:grid-cols-2">
        {TIPS.map((t) => (
          <li key={t.slug}>
            <Link href={`/meo/${t.slug}`} className="block rounded-lg border p-4 hover:bg-neutral-50">
              <span className="font-medium">{t.title}</span>
              <span className="mt-1 block text-sm text-neutral-600">{t.intro}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
