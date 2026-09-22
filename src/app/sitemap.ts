import type { MetadataRoute } from "next";
import { routing, type AppLocale, type AppPathname, type StaticPathname } from "@/i18n/routing";
import { localeMeta, countryIds } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";
import { countrySlugs } from "@/lib/countries";
import { readStore } from "@/lib/store";

const priorities: Partial<Record<StaticPathname, number>> = {
  "/": 1,
  "/repatriation-from-turkey": 0.9,
  "/repatriation-to-turkey": 0.9,
  "/what-to-do": 0.9,
  "/transit": 0.8,
  "/countries": 0.8,
  "/documents": 0.8,
  "/process": 0.8,
  "/cost-guide": 0.8,
  "/partners": 0.7,
  "/contact": 0.7,
  "/faq": 0.7,
  "/guides": 0.6,
  "/downloads": 0.5,
  "/case-tracking": 0.3,
};

const legal: StaticPathname[] = ["/privacy-notice", "/cookie-policy", "/privacy-policy", "/imprint"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  const staticPaths = (Object.keys(routing.pathnames) as AppPathname[]).filter(
    (p): p is StaticPathname => p !== "/countries/[slug]" && p !== "/guides/[slug]",
  );

  for (const pathname of staticPaths) {
    const languages: Record<string, string> = {};
    for (const l of routing.locales) languages[localeMeta[l].hreflang] = absoluteUrl(l, pathname);
    languages["x-default"] = absoluteUrl(routing.defaultLocale, pathname);
    for (const l of routing.locales) {
      entries.push({
        url: absoluteUrl(l, pathname),
        changeFrequency: legal.includes(pathname) ? "yearly" : "monthly",
        priority: legal.includes(pathname) ? 0.2 : (priorities[pathname] ?? 0.6),
        alternates: { languages },
      });
    }
  }

  for (const id of countryIds) {
    const hrefFor = (l: AppLocale) => ({ pathname: "/countries/[slug]" as const, params: { slug: countrySlugs[l][id] } });
    const languages: Record<string, string> = {};
    for (const l of routing.locales) languages[localeMeta[l].hreflang] = absoluteUrl(l, hrefFor(l));
    languages["x-default"] = absoluteUrl(routing.defaultLocale, hrefFor(routing.defaultLocale));
    for (const l of routing.locales) {
      entries.push({
        url: absoluteUrl(l, hrefFor(l)),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages },
      });
    }
  }

  const store = await readStore();
  for (const post of store.posts.filter((p) => p.published)) {
    const l = post.locale as AppLocale;
    if (!routing.locales.includes(l)) continue;
    entries.push({
      url: absoluteUrl(l, { pathname: "/guides/[slug]", params: { slug: post.slug } }),
      lastModified: new Date(post.updatedAt || post.date),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}
