import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Link from "next/link";

import { AdsProvider, Popunder } from "@/components/ads";
import { getMe } from "@/lib/me";

import "./globals.css";

const font = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:34817"),
  title: { default: "Test IQ và mẹo làm bài", template: "%s · Test IQ" },
  description: "Làm bài test IQ và học mẹo cho từng dạng đề",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const me = await getMe();
  const subscribed = !!me?.subscription_ends_at;
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true" && !subscribed;
  return (
    <html lang="vi">
      <body className={`${font.className} bg-white text-neutral-900 antialiased`}>
        <AdsProvider enabled={adsEnabled}>
          <header className="border-b">
            <nav className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3 text-sm">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-mark.svg" alt="" width={28} height={28} />
                Test IQ
              </Link>
              <Link href="/meo">Mẹo</Link>
              <Link href="/practice">Luyện</Link>
              <span className="flex-1" />
              {me?.is_admin && <Link href="/admin">Duyệt đề</Link>}
              {me ? (
                subscribed ? <span className="text-green-700">Gói tháng</span> : <Link href="/goi-thang">Bỏ quảng cáo</Link>
              ) : (
                <Link href="/login">Đăng nhập</Link>
              )}
            </nav>
          </header>
          {children}
          <footer className="mt-16 border-t">
            <div className="mx-auto flex max-w-3xl flex-wrap gap-4 px-4 py-6 text-sm text-neutral-500">
              <span>© {new Date().getFullYear()} Test IQ</span>
              <Link href="/dieu-khoan" className="hover:underline">Điều khoản sử dụng</Link>
              <Link href="/bao-mat" className="hover:underline">Chính sách bảo mật</Link>
              <Link href="/lien-he" className="hover:underline">Liên hệ</Link>
            </div>
          </footer>
          <Popunder loggedIn={!!me} serverSeenAt={me?.popunder_seen_at ?? null} />
        </AdsProvider>
      </body>
    </html>
  );
}
