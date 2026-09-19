import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { countryIds, countryIso } from "@/config/site";
import { countryIdFromSlug, countrySlugs, slugsForCountry } from "@/lib/countries";
import { localeOf, resolveLocale, type SlugParams } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Callout, ContactAside, CtaBand, InfoBlock, PageHeader, Section, TwoColumn } from "@/components/ui";

/**
 * dynamicParams stays at its default (true): with `false`, an on-demand regeneration
 * after revalidatePath() was routed to the [...rest] catch-all and cached as 404.
 * Unknown slugs still return notFound() below.
 */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    countryIds.map((id) => ({ locale, slug: countrySlugs[locale][id] })),
  );
}

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const { slug } = await params;
  const id = countryIdFromSlug(locale, slug);
  if (!id) return {};
  const t = await getTranslations({ locale, namespace: "countries" });
  return pageMetadata({
    locale,
    pathname: "/countries/[slug]",
    slugs: slugsForCountry(id),
    title: t(`${id}.title`),
    description: t(`${id}.description`),
  });
}

export default async function Page({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const id = countryIdFromSlug(locale, slug);
  if (!id) notFound();

  const messages = await getMessages();
  const c = messages.countries[id];
  const labels = messages.pages.countries;
  const nav = await getTranslations("nav");
  const tc = await getTranslations("common");
  const self = absoluteUrl(locale, { pathname: "/countries/[slug]", params: { slug } });

  return (
    <>
      <PageHeader
        title={c.title}
        intro={c.intro}
        eyebrow={c.name}
        crumbs={[{ name: nav("countries"), href: "/countries" }, { name: c.name }]}
        crumbUrls={[absoluteUrl(locale, "/countries"), self]}
      />
      <Section>
        <TwoColumn
          main={
            <div className="space-y-8">
              <InfoBlock title={labels.sectionProcess} items={c.process} />
              <InfoBlock title={labels.sectionDocs} items={c.documents} tone="paper" />
              <div>
                <h2 className="text-2xl text-teal-950">{labels.sectionNotes}</h2>
                <div className="mt-4 space-y-3">
                  {c.notes.map((n, i) => (
                    <Callout key={i} text={n} tone="teal" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted">{tc("disclaimerTimes")}</p>
            </div>
          }
          aside={<ContactAside />}
        />
      </Section>
      <CtaBand title={messages.home.contactTitle} text={messages.home.contactText} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: c.title,
          description: c.description,
          url: self,
          provider: { "@id": "https://dogubaticenaze.com/#business" },
          areaServed: [
            { "@type": "Country", name: "Türkiye" },
            { "@type": "Country", name: c.name, identifier: countryIso[id] },
          ],
        }}
      />
    </>
  );
}
