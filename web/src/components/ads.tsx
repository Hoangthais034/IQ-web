"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

import { markPopunderSeen } from "@/app/ads-actions";

const AdsContext = createContext(false);

export function AdsProvider({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  return <AdsContext.Provider value={enabled}>{children}</AdsContext.Provider>;
}

const env = {
  bannerSrc: process.env.NEXT_PUBLIC_ADSTERRA_BANNER_SRC,
  bannerKey: process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY,
  nativeSrc: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SRC,
  nativeContainer: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER,
  popunderSrc: process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_SRC,
  cooldownHours: Number(process.env.NEXT_PUBLIC_POPUNDER_COOLDOWN_HOURS ?? 48),
};

/**
 * Ads render inside a sandboxed iframe: scripts and new tabs are allowed, but the ad can
 * never navigate or redirect our page (no allow-top-navigation).
 */
export function AdSlot({ kind, className = "" }: { kind: "banner" | "native"; className?: string }) {
  const enabled = useContext(AdsContext);
  if (!enabled) return null;

  let html: string | null = null;
  let height = 250;
  if (kind === "banner" && env.bannerSrc && env.bannerKey) {
    html = `<script>atOptions={key:'${env.bannerKey}',format:'iframe',height:250,width:300,params:{}};</script><script src="${env.bannerSrc}"></script>`;
  } else if (kind === "native" && env.nativeSrc && env.nativeContainer) {
    html = `<script async data-cfasync="false" src="${env.nativeSrc}"></script><div id="${env.nativeContainer}"></div>`;
    height = 300;
  }
  if (!html) return null;

  return (
    <div className={`my-6 flex justify-center ${className}`}>
      <iframe
        title="Quảng cáo"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        srcDoc={`<!doctype html><html><body style="margin:0;display:flex;justify-content:center">${html}</body></html>`}
        style={{ width: "100%", maxWidth: 728, height, border: 0 }}
        loading="lazy"
      />
    </div>
  );
}

const POPUNDER_COOKIE = "pu_seen";
const POPUNDER_PATHS = [/^\/$/, /^\/meo(\/|$)/];

function readCookie(name: string) {
  return document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
}

/**
 * Loads the popunder script at most once per cooldown window (default 48h):
 * only on the home and tips pages, only after the visitor's first click, never for
 * subscribers or during a test. Logged-in users also get a server-side flag so it
 * holds across devices. Inside one visit Adsterra's own frequency cap (set to 1) applies.
 */
export function PopunderOnce({ loggedIn, serverSeenAt }: { loggedIn: boolean; serverSeenAt: string | null }) {
  const enabled = useContext(AdsContext);
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled || !env.popunderSrc) return;
    if (!POPUNDER_PATHS.some((re) => re.test(pathname))) return;
    if (readCookie(POPUNDER_COOKIE)) return;
    if (serverSeenAt && Date.now() - Date.parse(serverSeenAt) < env.cooldownHours * 3600_000) return;

    const onFirstClick = () => {
      document.cookie = `${POPUNDER_COOKIE}=1; max-age=${env.cooldownHours * 3600}; path=/; samesite=lax`;
      const s = document.createElement("script");
      s.src = env.popunderSrc!;
      s.async = true;
      document.body.appendChild(s);
      if (loggedIn) void markPopunderSeen();
    };
    window.addEventListener("click", onFirstClick, { once: true, capture: true });
    return () => window.removeEventListener("click", onFirstClick, { capture: true });
  }, [enabled, pathname, loggedIn, serverSeenAt]);

  return null;
}
