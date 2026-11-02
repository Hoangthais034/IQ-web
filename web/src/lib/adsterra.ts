// Adsterra helpers, following the setup used in the toolbox project: banners load inside the shared
// ad frame on a separate origin (ads.limcogito.com), the popunder runs on the page with per-browser limits.

export interface BannerUnit {
  key: string;
  src: string;
  width: number;
  height: number;
}

const HOST_PATTERN = /^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
const URL_KEY_PATTERN = /\/([A-Za-z0-9]{32})(?=\/|$)/;
const HOUR_MS = 3_600_000;

/** A plain https URL on a valid host, normalised; null otherwise (keeps that ad off). */
export function scriptUrl(raw: string | undefined): string | null {
  const value = (raw ?? "").trim();
  if (!value.startsWith("https://")) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && HOST_PATTERN.test(url.hostname) ? url.href : null;
  } catch {
    return null;
  }
}

/** Banner unit from Adsterra's current code (`<script src="https://<domain>/<n>/<32-char key>">`). */
export function bannerUnit(src: string | undefined, width: number, height: number): BannerUnit | null {
  const url = scriptUrl(src);
  const key = url ? URL_KEY_PATTERN.exec(new URL(url).pathname)?.[1] : undefined;
  return url && key ? { key, src: url, width, height } : null;
}

/** The shared ad frame page (no query or hash), or null. */
export function adFrameUrl(raw: string | undefined): string | null {
  const url = scriptUrl(raw);
  if (!url) return null;
  const parsed = new URL(url);
  return parsed.search || parsed.hash ? null : parsed.href;
}

/** Address of the shared ad frame for one banner, in the query format the frame reads. */
export function adFrameBannerUrl(frameUrl: string, unit: BannerUnit): string {
  const query = new URLSearchParams({ t: "banner", src: unit.src, key: unit.key, w: String(unit.width), h: String(unit.height) });
  return `${frameUrl}?${query.toString()}`;
}

/** Standalone HTML for one banner, used only when no ad frame URL is set. */
export function bannerDocument(unit: BannerUnit): string {
  const options = JSON.stringify({ key: unit.key, format: "iframe", height: unit.height, width: unit.width, params: {} });
  return (
    '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>' +
    `</head><body><script>atOptions=${options};</script><script src="${unit.src}"></script></body></html>`
  );
}

export interface PopunderRules {
  everyHours: number;
  fromPageview: number;
}

export interface PopunderState {
  views: number;
  lastShown: number;
}

/** Limits: at most once every `everyHours` (default 48, Hoang's choice), not before page view `fromPageview` (default 2). */
export function popunderRules(raw: { everyHours?: string; fromPageview?: string }): PopunderRules {
  const hours = (raw.everyHours ?? "").trim() === "" ? NaN : Number(raw.everyHours);
  const from = (raw.fromPageview ?? "").trim() === "" ? NaN : Number(raw.fromPageview);
  return {
    everyHours: Number.isFinite(hours) && hours >= 0 ? hours : 48,
    fromPageview: Number.isFinite(from) && from >= 0 ? Math.max(1, Math.floor(from)) : 2,
  };
}

export function popunderDue(state: PopunderState, rules: PopunderRules, now: number, serverLastShown = 0): boolean {
  if (state.views < rules.fromPageview) return false;
  const last = Math.max(state.lastShown, serverLastShown);
  return rules.everyHours === 0 || now - last >= rules.everyHours * HOUR_MS;
}

export function readPopunderState(raw: string | null): PopunderState {
  try {
    const value = JSON.parse(raw ?? "") as Partial<PopunderState>;
    if (typeof value.views === "number" && typeof value.lastShown === "number") return { views: value.views, lastShown: value.lastShown };
  } catch {
    // fall through
  }
  return { views: 0, lastShown: 0 };
}

/** Popunder only on the home page and tips pages: never during a test, on results, payment, login or admin. */
export function popunderAllowed(pathname: string): boolean {
  return /^\/$/.test(pathname) || /^\/meo(\/|$)/.test(pathname);
}
