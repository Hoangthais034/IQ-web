"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import Link from "next/link";

import { startAdGate, unlockAttempt } from "@/app/test/actions";
import { AdSlot } from "@/components/ads";

export function UnlockGate({ attemptId, paymentsEnabled }: { attemptId: string; paymentsEnabled: boolean }) {
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
    <div className="space-y-4 card p-5">
      <h2 className="text-xl font-bold text-ink">Mở khóa kết quả</h2>
      {left === null ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <button onClick={watchAd} disabled={pending} className={`btn btn-primary ${pending ? "is-loading" : ""}`}>
            Xem quảng cáo 15 giây
          </button>
          {paymentsEnabled && <Link
            href={`/goi-thang?next=${encodeURIComponent(`/test/${attemptId}/result`)}`}
            className="btn btn-outline"
          >
            Gói tháng 30.000đ, không quảng cáo
          </Link>}
        </div>
      ) : (
        <div className="space-y-3">
          
          <AdSlot className="my-0" />
          <button
            onClick={reveal}
            disabled={left > 0 || pending}
            className="btn btn-primary w-full"
          >
            {left > 0 ? `Xem điểm sau ${left} giây` : "Xem điểm"}
          </button>
        </div>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
