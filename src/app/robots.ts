import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** AI crawlers are deliberately NOT blocked: visibility in AI answers follows normal crawlability. */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
