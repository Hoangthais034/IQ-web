"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import Link from "next/link";

import { startAdGate, unlockAttempt } from "@/app/test/actions";
import { AdSlot } from "@/components/ads";

export function UnlockGate({ attemptId }: { attemptId: string }) {
  const router = useRouter();
  const [left, setLeft] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (left === null || left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  function watchAd() {
    startTransition(async () => {
      const gate = await startAdGate(attemptId);
      if (!gate) return setError("Không mở được quảng cáo, thử lại nhé.");
      const elapsed = Math.floor((Date.now() - Date.parse(gate.started_at)) / 1000);
      setLeft(Math.max(0, gate.seconds - elapsed));
    });
  }

  function reveal() {
    startTransition(async () => {
      if (await unlockAttempt(attemptId)) router.refresh();
      else setError("Chưa đủ thời gian xem quảng cáo.");
    });
  }

  return (
    <div className="space-y-4 rounded-xl border p-5">
      <h2 className="text-xl font-semibold">Mở khóa kết quả</h2>
      {left === null ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <button onClick={watchAd} disabled={pending} className="rounded-lg bg-neutral-900 px-4 py-3 text-white">
            Xem quảng cáo 15 giây
          </button>
          <Link
            href={`/goi-thang?next=${encodeURIComponent(`/test/${attemptId}/result`)}`}
            className="rounded-lg border px-4 py-3 text-center"
          >
            Gói tháng 30.000đ, không quảng cáo
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <AdSlot kind="native" className="my-0" />
          <AdSlot kind="banner" className="my-0" />
          <button
            onClick={reveal}
            disabled={left > 0 || pending}
            className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-white disabled:opacity-40"
          >
            {left > 0 ? `Xem điểm sau ${left} giây` : "Xem điểm"}
          </button>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
