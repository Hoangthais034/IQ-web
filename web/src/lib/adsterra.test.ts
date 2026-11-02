import { describe, expect, it } from "vitest";

import { adFrameBannerUrl, adFrameUrl, bannerUnit, popunderAllowed, popunderDue, popunderRules, readPopunderState, scriptUrl } from "./adsterra";

const KEY = "a".repeat(32);

describe("adsterra", () => {
  it("reads the banner key from the current Adsterra src", () => {
    expect(bannerUnit(`https://bauval.org/22/${KEY}`, 320, 50)).toEqual({ key: KEY, src: `https://bauval.org/22/${KEY}`, width: 320, height: 50 });
    expect(bannerUnit("http://bauval.org/22/x", 320, 50)).toBeNull();
    expect(bannerUnit("", 320, 50)).toBeNull();
  });

  it("builds the shared ad frame URL", () => {
    const frame = adFrameUrl("https://ads.limcogito.com/ad-frame.html")!;
    const unit = bannerUnit(`https://bauval.org/22/${KEY}`, 728, 90)!;
    const url = new URL(adFrameBannerUrl(frame, unit));
    expect(url.origin).toBe("https://ads.limcogito.com");
    expect(Object.fromEntries(url.searchParams)).toEqual({ t: "banner", src: unit.src, key: KEY, w: "728", h: "90" });
    expect(adFrameUrl("https://ads.limcogito.com/ad-frame.html?x=1")).toBeNull();
  });

  it("rejects non-https or odd script URLs", () => {
    expect(scriptUrl("javascript:alert(1)")).toBeNull();
    expect(scriptUrl("https://localhost/x.js")).toBeNull();
    expect(scriptUrl(" https://abscloud.org/1/abc ")).toBe("https://abscloud.org/1/abc");
  });

  it("popunder: never first page view, at most once per 48h, also honours the server timestamp", () => {
    const rules = popunderRules({});
    expect(rules).toEqual({ everyHours: 48, fromPageview: 2 });
    const now = Date.parse("2026-11-02T10:00:00Z");
    expect(popunderDue({ views: 1, lastShown: 0 }, rules, now)).toBe(false);
    expect(popunderDue({ views: 2, lastShown: 0 }, rules, now)).toBe(true);
    expect(popunderDue({ views: 5, lastShown: now - 47 * 3600_000 }, rules, now)).toBe(false);
    expect(popunderDue({ views: 5, lastShown: now - 49 * 3600_000 }, rules, now)).toBe(true);
    expect(popunderDue({ views: 5, lastShown: 0 }, rules, now, now - 3600_000)).toBe(false);
    expect(readPopunderState("garbage")).toEqual({ views: 0, lastShown: 0 });
  });

  it("popunder only on home and tips pages", () => {
    expect(popunderAllowed("/")).toBe(true);
    expect(popunderAllowed("/meo/day-so")).toBe(true);
    for (const p of ["/test/abc", "/test/abc/result", "/practice", "/goi-thang", "/login", "/admin"]) expect(popunderAllowed(p)).toBe(false);
  });
});
