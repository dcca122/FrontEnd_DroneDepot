import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://drone-depot.ai";
  return [
    "",
    "/how-it-works",
    "/services",
    "/services/inspections",
    "/services/mapping",
    "/services/fpv",
    "/services/construction-progress",
    "/rfp",
    "/concierge",
    "/case-studies",
    "/pricing",
    "/faq",
    "/contact",
  ].map((p) => ({ url: base + p, lastModified: new Date() }));
}
