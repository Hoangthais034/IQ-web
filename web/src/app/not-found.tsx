import Link from "next/link";

export const metadata = { title: "Không tìm thấy trang" };

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md space-y-4 px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-brand">404</p>
      <h1 className="text-2xl font-bold">Không tìm thấy trang này</h1>
      <p className="text-muted">Đường dẫn có thể đã đổi hoặc bị gõ sai.</p>
      <div className="flex justify-center gap-3 pt-2">
        <Link href="/" className="btn btn-primary">Về trang chủ</Link>
        <Link href="/meo" className="btn btn-outline">Xem mẹo</Link>
      </div>
    </main>
  );
}
