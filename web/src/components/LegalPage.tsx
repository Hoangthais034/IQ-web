export const LEGAL_UPDATED = "02/11/2026";

export function contactEmail() {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL || "(chưa cấu hình email liên hệ)";
}

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-neutral-500">Cập nhật lần cuối: {LEGAL_UPDATED}</p>
      <div className="mt-6 space-y-6 leading-relaxed text-neutral-800 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:mt-1 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </main>
  );
}
