"use server";

import { apiJson } from "@/lib/api";

export type PaymentInfo = {
  order_code: string;
  amount_vnd: number;
  status: "pending" | "paid" | "expired";
  qr_url: string;
  bank: string;
  account: string;
  expires_at: string;
  subscription_ends_at: string | null;
};

export async function paymentStatus(orderCode: string) {
  const { data } = await apiJson<PaymentInfo>(`/payments/${orderCode}`);
  return data?.status ?? null;
}
