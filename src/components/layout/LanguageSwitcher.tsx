"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale, type AppPathname, type StaticPathname } from "@/i18n/routing";
import { localeMeta } from "@/config/site";
import { GlobeIcon } from "../icons";

type SlugMap = Record<AppLocale, Record<string, string>>; // locale → countryId → slug

/**
 * Lists language NAMES (not flags: a flag shows a country, not a language).
 * Country pages have a different slug per locale, so the target slug is looked up.
 * Guide posts exist per language, so switching from one goes to that language's guide list.
 * Desktop: a compact <details> menu (works without JavaScript). Mobile menu: all languages as pills.
 */
export function LanguageSwitcher({ slugMap, variant = "inline" }: { slugMap: SlugMap; variant?: "inline" | "stack" }) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname() as AppPathname | string;
  const params = useParams<{ slug?: string }>();

  const known = (Object.keys(routing.pathnames) as AppPathname[]).includes(pathname as AppPathname);

  function hrefFor(target: AppLocale) {
    if (pathname === "/countries/[slug]" && params.slug) {
      const id = Object.entries(slugMap[locale]).find(([, s]) => s === params.slug)?.[0];
      const slug = id ? slugMap[target][id] : undefined;
      if (slug) return { pathname: "/countries/[slug]" as const, params: { slug } };
      return "/countries" as const;
    }
    if (pathname === "/guides/[slug]") return "/guides" as const;
    return (known ? pathname : "/") as StaticPathname;
  }

  const item = (l: AppLocale, cls: string) => (
    <Link
      key={l}
      href={hrefFor(l)}
      locale={l}
      hrefLang={l}
      lang={l}
      dir={localeMeta[l].dir}
      aria-current={l === locale ? "true" : undefined}
      className={cls}
    >
      {localeMeta[l].label}
    </Link>
  );

  if (variant === "stack") {
    return (
      <div className="flex flex-wrap gap-1">
        {routing.locales.map((l) =>
          item(
            l,
            `whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
              l === locale ? "bg-white/15 font-semibold text-white" : "text-teal-100/90 hover:bg-white/10 hover:text-white"
            }`,
          ),
        )}
      </div>
    );
  }

  return (
    <details className="group relative">
      <summary
        className="flex min-h-10 cursor-pointer list-none items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-teal-50 hover:bg-white/10 [&::-webkit-details-marker]:hidden"
        aria-label="Language"
      >
        <GlobeIcon size={18} className="text-teal-100/80" />
        {localeMeta[locale].label}
        <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">▾</span>
      </summary>
      <ul className="absolute end-0 z-50 mt-2 min-w-40 rounded-xl border border-white/10 bg-teal-950 p-1.5 shadow-card">
        {routing.locales.map((l) => (
          <li key={l}>
            {item(
              l,
              `block whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                l === locale ? "bg-white/15 font-semibold text-white" : "text-teal-100/90 hover:bg-white/10 hover:text-white"
              }`,
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}
