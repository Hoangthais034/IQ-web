import Link from "next/link";

export const metadata = { title: "Không tìm thấy trang" };

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md space-y-4 px-4 py-24 text-center">
      <p className="text-5xl font-bold text-neutral-300">404</p>
      <h1 className="text-2xl font-bold">Không tìm thấy trang này</h1>
      <p className="text-neutral-600">Đường dẫn có thể đã đổi hoặc bị gõ sai.</p>
      <div className="flex justify-center gap-3 pt-2">
        <Link href="/" className="rounded-lg bg-neutral-900 px-4 py-2 font-medium text-white">Về trang chủ</Link>
        <Link href="/meo" className="rounded-lg border px-4 py-2 font-medium">Xem mẹo</Link>
      </div>
    </main>
  );
}
