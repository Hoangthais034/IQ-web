import Link from "next/link";
import { redirect } from "next/navigation";

import { PaymentWatcher } from "@/components/PaymentWatcher";
import { apiJson } from "@/lib/api";
import { getMe } from "@/lib/me";

import type { PaymentInfo } from "./actions";

export const metadata = { title: "Gói tháng" };

export default async function SubscribePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "/" } = await searchParams;
  const me = await getMe();
  if (!me) redirect(`/login?next=${encodeURIComponent(`/goi-thang?next=${next}`)}`);

  const { status, data } = await apiJson<PaymentInfo>("/payments", { method: "POST" });
  return (
    <main className="mx-auto max-w-md space-y-5 px-4 py-10">
      <h1 className="text-2xl font-bold">Gói tháng 30.000đ</h1>
      <ul className="list-disc space-y-1 pl-5 text-neutral-700">
        <li>Xem điểm mọi bài test, không cần xem quảng cáo.</li>
        <li>Tắt toàn bộ quảng cáo trong 30 ngày.</li>
        <li>Không tự gia hạn. Mua thêm khi còn hạn thì cộng dồn.</li>
      </ul>
      {me.subscription_ends_at && (
        <p className="rounded bg-green-50 p-3 text-sm">
          Gói của bạn còn hạn đến {new Date(me.subscription_ends_at).toLocaleDateString("vi-VN")}.
        </p>
      )}
      {data ? (
        <PaymentWatcher payment={data} next={next} />
      ) : (
        <p className="text-red-600">
          {status === 503 ? "Thanh toán chưa được bật." : "Không tạo được đơn, thử lại sau."}{" "}
          <Link href={next} className="underline">Quay lại</Link>
        </p>
      )}
    </main>
  );
}
