import Link from "next/link";
import { notFound } from "next/navigation";

import { startAttempt } from "@/app/test/actions";
import { AdSlot } from "@/components/ads";
import { UnlockGate } from "@/components/UnlockGate";
import { apiJson } from "@/lib/api";
import { TYPE_LABELS, type Result } from "@/lib/types";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status, data } = await apiJson<Result>(`/attempts/${id}/result`);

  if (status === 404) notFound();
  if (status === 401) {
    return (
      <main className="mx-auto max-w-md space-y-4 px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Đã nộp bài!</h1>
        <p className="text-neutral-600">Đăng nhập Google để xem điểm. Bài làm của bạn sẽ được lưu vào tài khoản.</p>
        <Link
          href={`/login?next=${encodeURIComponent(`/test/${id}/result`)}`}
          className="inline-block rounded-lg bg-neutral-900 px-5 py-3 font-medium text-white"
        >
          Đăng nhập để xem điểm
        </Link>
      </main>
    );
  }
  if (status === 403) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12">
        <UnlockGate attemptId={id} />
      </main>
    );
  }
  if (!data) throw new Error(`Không tải được kết quả (${status})`);

  return (
    <main className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      <section className="text-center">
        {data.iq_estimate !== null && (
          <>
            <p className="text-neutral-500">Điểm IQ ước tính</p>
            <p className="text-6xl font-bold">{data.iq_estimate}</p>
          </>
        )}
        <p className="mt-2 text-neutral-600">
          Đúng {data.correct}/{data.total} câu
        </p>
        <p className="mt-1 text-xs text-neutral-400">Chỉ mang tính tham khảo, không phải bài test IQ chuẩn hóa.</p>
      </section>

      <AdSlot />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Theo dạng đề</h2>
        <ul className="space-y-2">
          {data.by_type.map((t) => (
            <li key={t.type} className="flex items-center gap-3">
              <span className="w-36 text-sm">{TYPE_LABELS[t.type]}</span>
              <span className="h-2 flex-1 rounded bg-neutral-100">
                <span className="block h-2 rounded bg-neutral-800" style={{ width: `${(100 * t.correct) / t.total}%` }} />
              </span>
              <span className="w-12 text-right text-sm tabular-nums">
                {t.correct}/{t.total}
              </span>
            </li>
          ))}
        </ul>
        {data.weakest_type && (
          <form action={startAttempt.bind(null, "practice", data.weakest_type)} className="mt-4">
            <button className="rounded-lg border px-4 py-2">Luyện dạng yếu nhất: {TYPE_LABELS[data.weakest_type]}</button>
          </form>
        )}
      </section>

      {data.wrong.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Câu sai ({data.wrong.length})</h2>
          <ol className="space-y-4">
            {data.wrong.map((w) => (
              <li key={w.position} className="rounded-lg border p-4">
                <p className="font-medium">
                  Câu {w.position + 1}: {w.prompt}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  Bạn chọn {w.chosen_key ?? "(bỏ trống)"}, đáp án đúng {w.correct_key}.
                </p>
                <p className="mt-1 text-sm">{w.explanation}</p>
                {w.tip_slug && (
                  <Link href={`/meo/${w.tip_slug}`} className="mt-1 inline-block text-sm underline">
                    Mẹo cho dạng này
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}
