import { notFound, redirect } from "next/navigation";

import { TestRunner } from "@/components/TestRunner";
import { apiJson } from "@/lib/api";
import type { Attempt } from "@/lib/types";

export const metadata = { title: "Đang làm bài", robots: { index: false, follow: false } };

export default async function AttemptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await apiJson<Attempt>(`/attempts/${id}`);
  if (!data) notFound();
  if (data.submitted_at) redirect(`/test/${id}/result`);
  return <TestRunner attempt={data} />;
}
