"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { saveAnswer, submitAttempt } from "@/app/test/actions";
import { QuestionView } from "@/components/QuestionView";
import type { Attempt, Feedback } from "@/lib/types";

function useCountdown(deadline: string | null) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!deadline) return;
    const end = Date.parse(deadline);
    const tick = () => setLeft(Math.max(0, Math.round((end - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [deadline]);
  return left;
}

export function TestRunner({ attempt }: { attempt: Attempt }) {
  const total = attempt.questions.length;
  const [index, setIndex] = useState(() => {
    const firstOpen = attempt.questions.findIndex((q) => !q.chosen_key);
    return firstOpen === -1 ? 0 : firstOpen;
  });
  const [answers, setAnswers] = useState<Record<number, string>>(() =>
    Object.fromEntries(attempt.questions.filter((q) => q.chosen_key).map((q) => [q.position, q.chosen_key!])),
  );
  const [feedback, setFeedback] = useState<Record<number, Feedback>>({});
  const [pending, startTransition] = useTransition();
  const left = useCountdown(attempt.deadline_at);
  const practice = attempt.mode === "practice";
  const q = attempt.questions[index];

  useEffect(() => {
    if (left === 0) startTransition(() => submitAttempt(attempt.id));
  }, [left, attempt.id]);

  function choose(key: string) {
    if (practice && feedback[q.position]) return;
    setAnswers((a) => ({ ...a, [q.position]: key }));
    startTransition(async () => {
      const fb = await saveAnswer(attempt.id, q.position, key);
      if (fb) setFeedback((f) => ({ ...f, [q.position]: fb }));
    });
  }

  const answered = Object.keys(answers).length;
  const fb = feedback[q.position];
  const mm = left === null ? "" : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <header className="mb-6 flex items-center justify-between text-sm text-neutral-600">
        <span>
          Câu {index + 1}/{total} · đã làm {answered}
        </span>
        {mm && <span className={`font-mono text-base ${left! < 60 ? "text-red-600" : ""}`}>{mm}</span>}
      </header>

      <QuestionView
        question={q}
        chosen={answers[q.position] ?? null}
        correctKey={fb?.correct_key}
        disabled={pending || (practice && !!fb)}
        onChoose={choose}
      />

      {fb && (
        <div className={`mt-5 rounded-lg p-4 ${fb.is_correct ? "bg-green-50" : "bg-red-50"}`}>
          <p className="font-medium">{fb.is_correct ? "Chính xác!" : `Chưa đúng. Đáp án là ${fb.correct_key}.`}</p>
          <p className="mt-1 text-neutral-700">{fb.explanation}</p>
          {fb.tip_slug && (
            <Link href={`/meo/${fb.tip_slug}`} className="mt-2 inline-block text-sm underline">
              Xem mẹo cho dạng này
            </Link>
          )}
        </div>
      )}

      <nav className="mt-8 flex items-center justify-between gap-3">
        <button
          className="rounded-lg border px-4 py-2 disabled:opacity-40"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
        >
          Câu trước
        </button>
        {index < total - 1 ? (
          <button className="rounded-lg border px-4 py-2" onClick={() => setIndex(index + 1)}>
            {answers[q.position] ? "Câu tiếp" : "Bỏ qua"}
          </button>
        ) : (
          <button
            className="rounded-lg bg-neutral-900 px-5 py-2 font-medium text-white disabled:opacity-50"
            disabled={pending}
            onClick={() => {
              const missing = total - answered;
              if (missing > 0 && !confirm(`Còn ${missing} câu chưa làm. Nộp bài luôn?`)) return;
              startTransition(() => submitAttempt(attempt.id));
            }}
          >
            Nộp bài
          </button>
        )}
      </nav>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {attempt.questions.map((x, i) => (
          <button
            key={x.position}
            onClick={() => setIndex(i)}
            className={`h-8 w-8 rounded text-xs ${i === index ? "ring-2 ring-neutral-900" : ""} ${
              answers[x.position] ? "bg-neutral-800 text-white" : "bg-neutral-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </main>
  );
}
