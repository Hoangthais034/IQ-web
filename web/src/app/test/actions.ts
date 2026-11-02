"use server";

import { redirect } from "next/navigation";

import { apiJson } from "@/lib/api";
import type { Attempt, Feedback, QuestionType } from "@/lib/types";

export async function startAttempt(mode: "full" | "practice", questionType?: QuestionType) {
  const { status, data } = await apiJson<Attempt>("/attempts", {
    method: "POST",
    body: JSON.stringify({ mode, question_type: questionType ?? null }),
  });
  if (!data) throw new Error(`Không tạo được bài test (${status})`);
  redirect(`/test/${data.id}`);
}

export async function saveAnswer(attemptId: string, position: number, key: string): Promise<Feedback | null> {
  const { status, data } = await apiJson<Feedback | null>(`/attempts/${attemptId}/answers/${position}`, {
    method: "PUT",
    body: JSON.stringify({ key }),
  });
  if (status >= 400) throw new Error(`save failed ${status}`);
  return data;
}

export async function submitAttempt(attemptId: string) {
  await apiJson(`/attempts/${attemptId}/submit`, { method: "POST" });
  redirect(`/test/${attemptId}/result`);
}

export async function startAdGate(attemptId: string) {
  const { data } = await apiJson<{ started_at: string; seconds: number }>(`/attempts/${attemptId}/ad-gate`, {
    method: "POST",
  });
  return data;
}

export async function unlockAttempt(attemptId: string): Promise<boolean> {
  const { status } = await apiJson(`/attempts/${attemptId}/unlock`, { method: "POST" });
  return status === 200;
}
