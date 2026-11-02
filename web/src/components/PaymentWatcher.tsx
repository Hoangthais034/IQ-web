"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { paymentStatus, type PaymentInfo } from "@/app/goi-thang/actions";

export function PaymentWatcher({ payment, next }: { payment: PaymentInfo; next: string }) {
  const [status, setStatus] = useState(payment.status);

  useEffect(() => {
    if (status !== "pending") return;
    const t = setInterval(async () => {
      const s = await paymentStatus(payment.order_code);
      if (s) setStatus(s);
    }, 4000);
    return () => clearInterval(t);
  }, [status, payment.order_code]);

  if (status === "paid") {
    return (
      <div className="space-y-3 rounded-lg bg-green-50 p-4">
        <p className="font-medium">Đã nhận thanh toán. Gói tháng đã được kích hoạt.</p>
        <Link href={next} className="inline-block rounded-lg bg-neutral-900 px-4 py-2 text-white">Tiếp tục</Link>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border p-4 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={payment.qr_url} alt="Mã QR chuyển khoản" className="mx-auto w-64" />
      <p className="text-sm text-neutral-600">Quét bằng app ngân hàng. Giữ nguyên nội dung chuyển khoản:</p>
      <p className="font-mono text-lg font-semibold">{payment.order_code}</p>
      <p className="text-sm text-neutral-600">
        {payment.amount_vnd.toLocaleString("vi-VN")}đ · {payment.bank} · {payment.account}
      </p>
      <p className="text-sm text-neutral-500">Trang tự cập nhật khi tiền về, thường dưới 1 phút.</p>
    </div>
  );
}
