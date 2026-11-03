"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { markPopunderSeen } from "@/app/ads-actions";
import {
  adFrameBannerUrl,
  adFrameUrl,
  bannerDocument,
  bannerUnit,
  popunderAllowed,
  popunderDue,
  popunderRules,
  readPopunderState,
  scriptUrl,
  type BannerUnit,
} from "@/lib/adsterra";

const AdsContext = createContext(false);

export function AdsProvider({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  return <AdsContext.Provider value={enabled}>{children}</AdsContext.Provider>;
}

// NEXT_PUBLIC_* values are inlined at build time, so they must be read with literal names.
const env = {
  src320: process.env.NEXT_PUBLIC_ADSTERRA_SRC_320X50,
  src728: process.env.NEXT_PUBLIC_ADSTERRA_SRC_728X90,
  frameUrl: process.env.NEXT_PUBLIC_ADSTERRA_FRAME_URL,
  popunderSrc: process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_SRC,
  popunderEveryHours: process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_EVERY_HOURS,
  popunderFromPageview: process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_FROM_PAGEVIEW,
};

// Different origin, so allow-same-origin is safe: the ad gets its own storage, can open new tabs,
// but cannot navigate or redirect our page.
const CROSS_ORIGIN_SANDBOX = "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox";

/** Adsterra banner: 728x90 when the slot is wide enough, else 320x50; fixed height so the layout never jumps. */
export function AdSlot({ className = "" }: { className?: string }) {
  const enabled = useContext(AdsContext);
  const ref = useRef<HTMLDivElement>(null);
  const mobile = useMemo(() => bannerUnit(env.src320, 320, 50), []);
  const desktop = useMemo(() => bannerUnit(env.src728, 728, 90), []);
  const frameUrl = useMemo(() => adFrameUrl(env.frameUrl), []);
  const [unit, setUnit] = useState<BannerUnit | null>(null);

  useEffect(() => {
    if (!enabled || !mobile || !ref.current) return;
    setUnit(desktop && ref.current.clientWidth >= desktop.width ? desktop : mobile);
  }, [enabled, mobile, desktop]);

  if (!enabled || !mobile) return null;
  return (
    <aside aria-label="Quảng cáo" className={`my-6 ${className}`}>
      <p className="mb-1 text-center text-[11px] text-subtle">Quảng cáo</p>
      <div
        ref={ref}
        className="flex w-full items-center justify-center overflow-hidden rounded-md bg-sunken"
        style={{ height: unit?.height ?? 50 }}
      >
        {unit && (
          <iframe
            title={`Quảng cáo ${unit.width}x${unit.height}`}
            {...(frameUrl ? { src: adFrameBannerUrl(frameUrl, unit), sandbox: CROSS_ORIGIN_SANDBOX } : { srcDoc: bannerDocument(unit) })}
            width={unit.width}
            height={unit.height}
            scrolling="no"
            className="block max-w-full border-0"
          />
        )}
      </div>
    </aside>
  );
}

const STORAGE_KEY = "adsterra-popunder";

/**
 * Adsterra popunder, loaded with the page like Adsterra's own code, but only on the home and tips
 * pages, never on a visitor's first page view and at most once every 48 hours (counted per browser,
 * and also server-side for logged-in users so it holds across devices). Off for subscribers and when
 * localStorage is blocked. Adsterra's own frequency cap applies on top.
 */
export function Popunder({ loggedIn, serverSeenAt }: { loggedIn: boolean; serverSeenAt: string | null }) {
  const enabled = useContext(AdsContext);
  const pathname = usePathname();

  useEffect(() => {
    const src = scriptUrl(env.popunderSrc);
    if (!enabled || !src || document.querySelector("script[data-adsterra-popunder]")) return;
    const rules = popunderRules({ everyHours: env.popunderEveryHours, fromPageview: env.popunderFromPageview });
    const now = Date.now();
    let due: boolean;
    try {
      const seen = readPopunderState(localStorage.getItem(STORAGE_KEY));
      const state = { ...seen, views: seen.views + 1 };
      due = popunderAllowed(pathname) && popunderDue(state, rules, now, serverSeenAt ? Date.parse(serverSeenAt) : 0);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(due ? { ...state, lastShown: now } : state));
    } catch {
      return;
    }
    if (!due) return;
    const script = document.createElement("script");
    script.src = src;
    script.setAttribute("data-cfasync", "false");
    script.dataset.adsterraPopunder = "true";
    document.body.appendChild(script);
    if (loggedIn) void markPopunderSeen();
  }, [enabled, pathname, loggedIn, serverSeenAt]);

  return null;
}
