import Link from "next/link";
import { notFound } from "next/navigation";

import { startAttempt } from "@/app/test/actions";
import { AdSlot } from "@/components/ads";
import { Icon, TypeIcon } from "@/components/icons";
import { UnlockGate } from "@/components/UnlockGate";
import { ButtonLink, Callout, Chip, PageShell } from "@/components/ui";
import { TYPE_META } from "@/content/types";
import { apiJson } from "@/lib/api";
import { getMe } from "@/lib/me";
import { TYPE_LABELS, type Result } from "@/lib/types";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status, data } = await apiJson<Result>(`/attempts/${id}/result`);

  if (status === 404) notFound();
  if (status === 401) {
    return (
      <PageShell width="max-w-md">
        <div className="card space-y-4 p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success"><Icon name="check" className="h-7 w-7" /></span>
          <h1 className="text-2xl font-extrabold text-ink">Đã nộp bài!</h1>
          <p className="text-muted">Đăng nhập Google để xem điểm. Bài làm của bạn sẽ được lưu vào tài khoản.</p>
          <ButtonLink href={`/login?next=${encodeURIComponent(`/test/${id}/result`)}`}>Đăng nhập để xem điểm</ButtonLink>
        </div>
      </PageShell>
    );
  }
  if (status === 403) {
    const me = await getMe();
    return (
      <PageShell width="max-w-xl">
        <UnlockGate attemptId={id} paymentsEnabled={!!me?.payments_enabled} />
      </PageShell>
    );
  }
  if (!data) throw new Error(`Không tải được kết quả (${status})`);

  const pct = data.total ? Math.round((100 * data.correct) / data.total) : 0;
  const marker = data.iq_estimate === null ? 0 : Math.min(100, Math.max(0, ((data.iq_estimate - 55) / 90) * 100));
  return (
    <PageShell>
      <div className="space-y-8">
        <section className="card overflow-hidden">
          <div className="bg-gradient-to-br from-brand-soft to-white p-6 text-center sm:p-8">
            {data.iq_estimate !== null && (
              <>
                <p className="font-semibold text-muted">Điểm IQ ước tính</p>
                <p className="text-7xl font-extrabold leading-none text-brand-700">{data.iq_estimate}</p>
                <div className="mx-auto mt-6 max-w-md">
                  <div className="relative h-3 rounded-full bg-gradient-to-r from-sun via-brand to-teal">
                    <span className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-ink shadow" style={{ left: `${marker}%` }} aria-hidden="true" />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-subtle"><span>55</span><span>100</span><span>145</span></div>
                </div>
              </>
            )}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Chip icon="check" tone="teal">Đúng {data.correct}/{data.total} câu</Chip>
              <Chip icon="chart" tone="brand">{pct}% chính xác</Chip>
            </div>
          </div>
          <p className="border-t border-line px-6 py-3 text-center text-xs text-subtle">Chỉ mang tính tham khảo, không phải bài test IQ chuẩn hóa.</p>
        </section>

        <AdSlot />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-ink">Theo dạng đề</h2>
          <ul className="card divide-y divide-line">
            {data.by_type.map((t) => {
              const m = TYPE_META[t.type];
              const weakest = data.weakest_type === t.type;
              return (
                <li key={t.type} className="flex items-center gap-3 p-4">
                  <TypeIcon type={t.type} size="sm" />
                  <span className="w-28 text-sm font-semibold text-ink sm:w-40">
                    {TYPE_LABELS[t.type]}
                    {weakest && <span className="ml-2 rounded-full bg-sun-soft px-2 py-0.5 text-xs font-semibold text-sun-ink">Yếu nhất</span>}
                  </span>
                  <span className="h-2.5 flex-1 rounded-full bg-sunken" role="progressbar" aria-valuenow={t.correct} aria-valuemax={t.total} aria-label={TYPE_LABELS[t.type]}>
                    <span className={`block h-2.5 rounded-full ${m.bar}`} style={{ width: `${t.total ? (100 * t.correct) / t.total : 0}%` }} />
                  </span>
                  <span className="w-12 text-right text-sm font-semibold tabular-nums text-ink">{t.correct}/{t.total}</span>
                </li>
              );
            })}
          </ul>
          {data.weakest_type && (
            <form action={startAttempt.bind(null, "practice", data.weakest_type)}>
              <button className="btn btn-outline"><Icon name="target" className="h-5 w-5" /> Luyện dạng yếu nhất: {TYPE_LABELS[data.weakest_type]}</button>
            </form>
          )}
        </section>

        {data.wrong.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-ink">Câu sai ({data.wrong.length})</h2>
            <div className="card divide-y divide-line">
              {data.wrong.map((w) => (
                <details key={w.position} className="group p-4">
                  <summary className="-m-2 flex items-center justify-between gap-3 rounded-lg p-2 font-semibold text-ink transition-colors hover:bg-brand-soft">
                    <span>Câu {w.position + 1}: {w.prompt}</span>
                    <Icon name="arrow" className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="mt-4 space-y-3">
                    <p className="flex flex-wrap gap-2 text-sm">
                      <span className="rounded-full bg-danger-soft px-3 py-1 font-semibold text-danger">Bạn chọn: {w.chosen_key ?? "(bỏ trống)"}</span>
                      <span className="rounded-full bg-success-soft px-3 py-1 font-semibold text-success">Đáp án: {w.correct_key}</span>
                    </p>
                    <Callout tone="info" icon="bulb" title="Giải thích">{w.explanation}</Callout>
                    {w.tip_slug && <Link href={`/meo/${w.tip_slug}`} className="btn btn-soft !min-h-9 !px-3 !py-1 text-sm">Mẹo cho dạng này</Link>}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ) : (
          <Callout tone="tip" icon="star" title="Tuyệt vời!">Bạn không sai câu nào.</Callout>
        )}
      </div>
    </PageShell>
  );
}
