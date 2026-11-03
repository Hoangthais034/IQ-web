import type { MetadataRoute } from "next";

import { TIPS } from "@/content/tips";
import { SITE_URL } from "@/lib/site";

// Bump when the page content changes meaningfully, so lastmod stays honest.
const UPDATED = new Date("2026-11-03");

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly") => ({
    url: `${SITE_URL}${path}`, lastModified: UPDATED, changeFrequency, priority,
  });
  return [
    page("/", 1, "weekly"),
    page("/meo", 0.9, "weekly"),
    ...TIPS.map((t) => page(`/meo/${t.slug}`, 0.8, "monthly")),
    page("/practice", 0.7, "monthly"),
    page("/test", 0.8, "monthly"),
    page("/lien-he", 0.3, "yearly"),
    page("/dieu-khoan", 0.2, "yearly"),
    page("/bao-mat", 0.2, "yearly"),
  ];
}
