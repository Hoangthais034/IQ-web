import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Link from "next/link";

import { AdsProvider, Popunder } from "@/components/ads";
import { NavLink } from "@/components/NavLinks";
import { getMe } from "@/lib/me";

import "./globals.css";

const font = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700", "800"] });

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
      <body className={`${font.className} bg-white text-ink antialiased`}>
        <AdsProvider enabled={adsEnabled}>
          <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
            <nav className="mx-auto flex max-w-5xl items-center gap-1 px-4 py-2.5 text-sm">
              <Link href="/" className="mr-2 flex items-center gap-2 rounded-lg px-1 py-1 text-base font-extrabold text-ink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-mark.svg" alt="" width={30} height={30} />
                Test IQ
              </Link>
              <NavLink href="/meo">Mẹo</NavLink>
              <NavLink href="/practice">Luyện tập</NavLink>
              <span className="flex-1" />
              {me?.is_admin && <NavLink href="/admin">Duyệt đề</NavLink>}
              {me ? (
                subscribed ? (
                  <span className="rounded-full bg-success-soft px-3 py-1 font-semibold text-success">Gói tháng</span>
                ) : me.payments_enabled ? (
                  <NavLink href="/goi-thang">Bỏ quảng cáo</NavLink>
                ) : null
              ) : (
                <NavLink href="/login">Đăng nhập</NavLink>
              )}
              <Link href="/test" className="btn btn-primary ml-2 !min-h-9 !px-4 !py-1.5">Làm bài test</Link>
            </nav>
          </header>
          {children}
          <footer className="mt-16 border-t border-line bg-sunken">
            <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 text-sm text-muted sm:grid-cols-[1fr_auto]">
              <div className="space-y-1">
                <p className="flex items-center gap-2 font-bold text-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-mark.svg" alt="" width={22} height={22} /> Test IQ
                </p>
                <p>Thắp sáng tư duy mỗi ngày. Kết quả chỉ mang tính tham khảo.</p>
                <p>© {new Date().getFullYear()} Test IQ</p>
              </div>
              <nav className="flex flex-wrap items-start gap-x-5 gap-y-2 font-medium">
                <Link href="/meo" className="hover:text-brand-800 hover:underline">Mẹo làm bài</Link>
                <Link href="/dieu-khoan" className="hover:text-brand-800 hover:underline">Điều khoản sử dụng</Link>
                <Link href="/bao-mat" className="hover:text-brand-800 hover:underline">Chính sách bảo mật</Link>
                <Link href="/lien-he" className="hover:text-brand-800 hover:underline">Liên hệ</Link>
              </nav>
            </div>
          </footer>
          <Popunder loggedIn={!!me} serverSeenAt={me?.popunder_seen_at ?? null} />
        </AdsProvider>
      </body>
    </html>
  );
}
