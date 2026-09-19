import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { countryIds } from "@/config/site";
import { getSite, telUrl } from "@/lib/site";
import { countrySlugs } from "@/lib/countries";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { CtaBand, PageHeader, Section } from "@/components/ui";
import { ArrowIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "pages.countries" });
  return pageMetadata({ locale, pathname: "/countries", title: t("title"), description: t("description") });
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const p = messages.pages.countries;
  const tc = await getTranslations("common");
  const site = await getSite();

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} crumbs={[{ name: p.title }]} crumbUrls={[absoluteUrl(locale, "/countries")]} />
      <Section>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {countryIds.map((id) => {
            const c = messages.countries[id];
            return (
              <Link
                key={id}
                href={{ pathname: "/countries/[slug]", params: { slug: countrySlugs[locale][id] } }}
                className="card group flex flex-col transition-shadow hover:shadow-lg"
              >
                <span className="flex items-center gap-2 text-gold-700">
                  <MapPinIcon size={18} />
                  <span className="text-sm font-semibold uppercase tracking-wider">{c.name}</span>
                </span>
                <h2 className="mt-3 text-xl text-teal-950">{c.title}</h2>
                <p className="mt-2 flex-1 text-sm text-ink-soft">{c.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 font-semibold text-teal-700 group-hover:text-teal-900">
                  {tc("learnMore")} <ArrowIcon size={18} />
                </span>
              </Link>
            );
          })}
          <div className="card flex flex-col justify-center bg-teal-950 text-white">
            <h2 className="text-xl">{p.notListed}</h2>
            <p className="mt-2 text-teal-100/90">{p.notListedText}</p>
            <a href={telUrl(site.phones[0].e164)} className="btn-primary mt-5 self-start">
              <PhoneIcon /> {site.phones[0].display}
            </a>
          </div>
        </div>
      </Section>
      <CtaBand title={messages.home.contactTitle} text={messages.home.contactText} />
    </>
  );
}
