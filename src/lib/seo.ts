import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppLocale, type AppPathname, type StaticPathname } from "@/i18n/routing";
import { localeMeta, site as defaults } from "@/config/site";
import type { SiteConfig } from "./site";

export type Href =
  | StaticPathname
  | { pathname: "/countries/[slug]"; params: { slug: string } }
  | { pathname: "/guides/[slug]"; params: { slug: string } };

function baseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://dogubaticenaze.com";
}

/** Absolute URL of a route in a given locale (Turkish stays unprefixed). */
export function absoluteUrl(locale: AppLocale, href: Href) {
  const path = getPathname({ locale, href } as Parameters<typeof getPathname>[0]);
  return new URL(path, baseUrl()).toString();
}

/**
 * Builds canonical + hreflang alternates for a page. For dynamic pages pass `slugs`
 * keyed by locale; locales missing from `slugs` are left out of the alternates.
 */
export function alternatesFor(
  locale: AppLocale,
  pathname: AppPathname,
  slugs?: Partial<Record<AppLocale, string>>,
): NonNullable<Metadata["alternates"]> {
  const isDynamic = pathname === "/countries/[slug]" || pathname === "/guides/[slug]";
  const hrefFor = (l: AppLocale): Href | null => {
    if (!isDynamic) return pathname as StaticPathname;
    const slug = slugs?.[l];
    if (!slug) return null;
    return { pathname, params: { slug } } as Href;
  };

  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    const h = hrefFor(l);
    if (h) languages[localeMeta[l].hreflang] = absoluteUrl(l, h);
  }
  const def = hrefFor(routing.defaultLocale);
  if (def) languages["x-default"] = absoluteUrl(routing.defaultLocale, def);

  const self = hrefFor(locale);
  return { canonical: self ? absoluteUrl(locale, self) : undefined, languages };
}

export function pageMetadata(args: {
  locale: AppLocale;
  pathname: AppPathname;
  title: string;
  description: string;
  slugs?: Partial<Record<AppLocale, string>>;
}): Metadata {
  const { locale, pathname, title, description, slugs } = args;
  const alternates = alternatesFor(locale, pathname, slugs);
  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical as string | undefined,
      siteName: defaults.legalName,
      locale: localeMeta[locale].ogLocale,
      type: "website",
      images: [{ url: defaults.ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* ---------- JSON-LD builders (schema.org) ---------- */

export function localBusinessJsonLd(args: {
  locale: AppLocale;
  site: SiteConfig;
  description: string;
  serviceNames: string[];
  countryNames: string[];
}) {
  const { locale, site, description, serviceNames, countryNames } = args;
  const address = site.address;
  const business: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.legalName,
    alternateName: "Doğu Batı International Funeral Services",
    url: absoluteUrl(locale, "/"),
    description,
    telephone: site.phones[0]?.e164,
    email: site.email,
    image: new URL(site.ogImage, baseUrl()).toString(),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.district,
      addressRegion: address.city,
      postalCode: address.postalCode,
      addressCountry: address.countryCode,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    areaServed: [{ "@type": "Country", name: "Türkiye" }, ...countryNames.map((name) => ({ "@type": "Country", name }))],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: serviceNames[0],
      itemListElement: serviceNames.map((serviceType) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", serviceType },
      })),
    },
    availableLanguage: [...routing.locales],
  };
  if (address.geo) {
    business.geo = { "@type": "GeoCoordinates", latitude: address.geo.lat, longitude: address.geo.lng };
  }
  if (site.facts.foundedYear) business.foundingDate = String(site.facts.foundedYear);
  if (site.sameAs.length) business.sameAs = site.sameAs;
  return business;
}

export function serviceJsonLd(args: { locale: AppLocale; pathname: StaticPathname; name: string; description: string; phone: string }) {
  const { locale, pathname, name, description, phone } = args;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url: absoluteUrl(locale, pathname),
    provider: { "@id": `${baseUrl()}/#business` },
    areaServed: { "@type": "Country", name: "Türkiye" },
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: { "@type": "ContactPoint", telephone: phone, contactType: "customer service" },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: item.url })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
  };
}

export function articleJsonLd(args: { url: string; title: string; description: string; date: string; updated: string; locale: AppLocale }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    datePublished: args.date,
    dateModified: args.updated,
    inLanguage: args.locale,
    mainEntityOfPage: args.url,
    author: { "@type": "Organization", name: defaults.legalName, "@id": `${baseUrl()}/#business` },
    publisher: { "@id": `${baseUrl()}/#business` },
  };
}

export function reviewsJsonLd(reviews: { name: string; text: string; date: string; locale: string }[]) {
  return reviews.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@id": `${baseUrl()}/#business` },
    author: { "@type": "Person", name: r.name },
    reviewBody: r.text,
    datePublished: r.date,
    inLanguage: r.locale,
  }));
}
