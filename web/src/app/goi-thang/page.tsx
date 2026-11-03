import Link from "next/link";
import { redirect } from "next/navigation";

import type { IconName } from "@/components/icons";
import { IconTile } from "@/components/ui";
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
      <h1 className="text-3xl font-extrabold text-ink">Gói tháng 30.000đ</h1>
      <ul className="space-y-3">
        {[
          ["chart", "Xem điểm mọi bài test, không cần xem quảng cáo."],
          ["shield", "Tắt toàn bộ quảng cáo trong 30 ngày."],
          ["gift", "Không tự gia hạn. Mua thêm khi còn hạn thì cộng dồn."],
        ].map(([icon, text]) => (
          <li key={text} className="card flex items-center gap-3 p-3">
            <IconTile name={icon as IconName} tone="teal" />
            <span className="text-ink">{text}</span>
          </li>
        ))}
      </ul>
      {me.subscription_ends_at && (
        <p className="rounded-xl border border-success bg-success-soft p-3 text-sm text-success">
          Gói của bạn còn hạn đến {new Date(me.subscription_ends_at).toLocaleDateString("vi-VN")}.
        </p>
      )}
      {data ? (
        <PaymentWatcher payment={data} next={next} />
      ) : (
        <p className="text-danger">
          {status === 503 ? "Thanh toán chưa được bật." : "Không tạo được đơn, thử lại sau."}{" "}
          <Link href={next} className="font-semibold underline">Quay lại</Link>
        </p>
      )}
    </main>
  );
}
