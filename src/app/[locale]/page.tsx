import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { countryIds } from "@/config/site";
import { countrySlugs } from "@/lib/countries";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { faqJsonLd, localBusinessJsonLd, pageMetadata, reviewsJsonLd } from "@/lib/seo";
import { getSite, telUrl, whatsappUrl } from "@/lib/site";
import { readStore } from "@/lib/store";
import { JsonLd } from "@/components/JsonLd";
import { ProcessSteps } from "@/components/ProcessSteps";
import { ContactForm } from "@/components/ContactForm";
import { Section, SectionHeading, formatDate } from "@/components/ui";
import {
  AlertIcon,
  ArrowIcon,
  DocumentIcon,
  MapPinIcon,
  PhoneIcon,
  PlaneDownIcon,
  PlaneIcon,
  ShieldIcon,
  SnowflakeIcon,
  TransitIcon,
  TruckIcon,
  UsersIcon,
  WhatsAppIcon,
} from "@/components/icons";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    ...pageMetadata({ locale, pathname: "/", title: t("defaultTitle"), description: t("defaultDescription") }),
    title: { absolute: t("defaultTitle") },
  };
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const nav = await getTranslations("nav");
  const tr = await getTranslations("reviews");
  const messages = await getMessages();
  const site = await getSite();
  const store = await readStore();
  const faq = messages.pages.faq.items.slice(0, 5);
  const reviews = site.flags.showReviews
    ? store.reviews.filter((r) => r.published && r.consent).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
    : [];
  const featuredCountries = countryIds.slice(0, 10);

  const paths = [
    { href: "/repatriation-from-turkey", title: t("path1Title"), text: t("path1Text"), Icon: PlaneIcon },
    { href: "/repatriation-to-turkey", title: t("path2Title"), text: t("path2Text"), Icon: PlaneDownIcon },
    { href: "/transit", title: t("path3Title"), text: t("path3Text"), Icon: TransitIcon },
  ] as const;

  const support = [
    { href: "/documents", title: t("support1Title"), text: t("support1Text"), Icon: DocumentIcon },
    { href: "/coffins", title: t("support2Title"), text: t("support2Text"), Icon: ShieldIcon },
    { href: "/process", title: t("support3Title"), text: t("support3Text"), Icon: PlaneIcon },
    { href: "/domestic-transfer", title: t("support4Title"), text: t("support4Text"), Icon: TruckIcon },
  ] as const;

  const why = [
    { title: t("why1Title"), text: t("why1Text"), Icon: UsersIcon },
    { title: t("why2Title"), text: t("why2Text"), Icon: DocumentIcon },
    { title: t("why3Title"), text: t("why3Text"), Icon: SnowflakeIcon },
    { title: t("why4Title"), text: t("why4Text"), Icon: ShieldIcon },
  ];

  const trust = [t("trust1"), t("trust2"), t("trust3")];
  const facts = [
    site.facts.foundedYear && { label: t("factsFounded"), value: String(site.facts.foundedYear) },
    site.facts.completedTransfers && { label: t("factsTransfers"), value: `${site.facts.completedTransfers}+` },
    site.facts.countriesServed && { label: t("factsCountries"), value: String(site.facts.countriesServed) },
  ].filter((f): f is { label: string; value: string } => Boolean(f));

  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-teal-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #D4AF37 0, transparent 35%), radial-gradient(circle at 85% 70%, #0F766E 0, transparent 40%)",
          }}
        />
        <div className="container-x relative grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow text-gold-300">{t("heroEyebrow")}</p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">{t("heroTitle")}</h1>
            <p className="mt-6 max-w-2xl text-lg text-teal-100/90">{t("heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={telUrl(site.phones[0].e164)} className="btn-primary">
                <PhoneIcon /> {tc("callNow")}
              </a>
              <a href={whatsappUrl(site.whatsapp, tc("whatsappMessage"))} className="btn-whatsapp" target="_blank" rel="noopener">
                <WhatsAppIcon /> {tc("whatsapp")}
              </a>
              <Link href="/contact" className="btn-ghost-light">
                {tc("requestQuote")}
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-teal-100/90">
              {trust.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-gold-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            {facts.length > 0 && (
              <dl className="mt-8 flex flex-wrap gap-8">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dd className="text-3xl font-semibold text-gold-300">{f.value}</dd>
                    <dt className="text-sm text-teal-100/80">{f.label}</dt>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <aside className="rounded-card border border-gold-400/30 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <AlertIcon className="text-gold-300" size={24} />
              <h2 className="text-xl text-white">{t("urgentTitle")}</h2>
            </div>
            <p className="mt-3 text-teal-100/90">{t("urgentText")}</p>
            <ol className="mt-4 space-y-3">
              {[t("urgent1"), t("urgent2"), t("urgent3")].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold-400 text-sm font-semibold text-teal-950">
                    {i + 1}
                  </span>
                  <span className="text-teal-50">{step}</span>
                </li>
              ))}
            </ol>
            <Link href="/what-to-do" className="mt-5 inline-flex items-center gap-2 font-semibold text-gold-300 hover:text-gold-100">
              {t("urgentCta")} <ArrowIcon size={18} />
            </Link>
          </aside>
        </div>
      </section>

      {/* 3. Three paths */}
      <Section tone="paper">
        <SectionHeading title={t("pathsTitle")} text={t("pathsSubtitle")} />
        <div className="grid gap-5 md:grid-cols-3">
          {paths.map(({ href, title, text, Icon }) => (
            <Link key={href} href={href} className="card group flex flex-col transition-shadow hover:shadow-lg">
              <span className="flex size-12 items-center justify-center rounded-full bg-teal-950 text-gold-300">
                <Icon size={24} />
              </span>
              <h3 className="mt-5 text-xl text-teal-950">{title}</h3>
              <p className="mt-2 flex-1 text-ink-soft">{text}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-teal-700 group-hover:text-teal-900">
                {tc("learnMore")} <ArrowIcon size={18} />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 5. Process */}
      <Section>
        <SectionHeading title={t("processTitle")} text={t("processSubtitle")} />
        <ProcessSteps compact />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/process" className="btn-outline">
            {nav("process")} <ArrowIcon size={18} />
          </Link>
          <Link href="/cost-guide" className="btn-outline">
            {nav("costGuide")} <ArrowIcon size={18} />
          </Link>
        </div>
      </Section>

      {/* 6. Support services */}
      <Section tone="paper">
        <SectionHeading title={t("supportTitle")} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {support.map(({ href, title, text, Icon }) => (
            <Link key={href} href={href} className="card transition-shadow hover:shadow-lg">
              <Icon className="text-teal-700" size={26} />
              <h3 className="mt-4 text-lg text-teal-950">{title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{text}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* 7. Countries */}
      <Section>
        <SectionHeading title={t("countriesTitle")} text={t("countriesSubtitle")} />
        <ul className="flex flex-wrap gap-3">
          {featuredCountries.map((id) => (
            <li key={id}>
              <Link
                href={{ pathname: "/countries/[slug]", params: { slug: countrySlugs[locale][id] } }}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-5 font-medium text-teal-950 hover:border-teal-700 hover:text-teal-700"
              >
                <MapPinIcon size={16} className="text-gold-700" />
                {messages.countries[id].name}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/countries" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-teal-950 px-5 font-medium text-white hover:bg-teal-800">
              {tc("allCountries")} <ArrowIcon size={16} />
            </Link>
          </li>
        </ul>
      </Section>

      {/* 8. Why us */}
      <Section tone="teal">
        <SectionHeading title={t("whyTitle")} light />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {why.map(({ title, text, Icon }) => (
            <div key={title} className="rounded-card border border-white/10 bg-white/5 p-6">
              <Icon className="text-gold-300" size={26} />
              <h3 className="mt-4 text-lg text-white">{title}</h3>
              <p className="mt-2 text-sm text-teal-100/85">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 9. Reviews (only real, consented ones) */}
      {reviews.length > 0 && (
        <Section>
          <SectionHeading title={t("reviewsTitle")} text={t("reviewsSubtitle")} />
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <li key={r.id} className="card flex flex-col" lang={r.locale}>
                <p className="flex-1 text-ink-soft">&ldquo;{r.text}&rdquo;</p>
                <footer className="mt-4 text-sm">
                  <p className="font-semibold text-teal-950">
                    {r.name}
                    {r.country ? `, ${r.country}` : ""}
                  </p>
                  <p className="text-muted">
                    {formatDate(r.date, locale)}
                    {r.source ? ` · ${tr("sourceLabel")}: ${r.source}` : ""}
                  </p>
                </footer>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 10. Partners strip */}
      <Section tone="paper">
        <div className="flex flex-col gap-6 rounded-card border border-line bg-white p-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">{nav("partners")}</p>
            <h2 className="mt-2 text-2xl text-teal-950">{t("partnersTitle")}</h2>
            <p className="mt-3 text-ink-soft">{t("partnersText")}</p>
          </div>
          <Link href="/partners" className="btn-secondary shrink-0">
            {t("partnersCta")} <ArrowIcon size={18} />
          </Link>
        </div>
      </Section>

      {/* 11. FAQ */}
      <Section>
        <SectionHeading title={t("faqTitle")} />
        <div className="grid gap-3 lg:grid-cols-2">
          {faq.map((item, i) => (
            <details key={i} className="group rounded-card border border-line bg-white p-5 open:shadow-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-teal-950 [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="text-gold-700 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/faq" className="btn-outline">
            {t("faqCta")} <ArrowIcon size={18} />
          </Link>
        </div>
      </Section>

      {/* 12. Contact */}
      <Section tone="paper" id="contact">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading title={t("contactTitle")} text={t("contactText")} />
            <div className="space-y-3 text-ink">
              {site.phones.map((p) => (
                <a key={p.e164} href={telUrl(p.e164)} className="flex items-center gap-3 text-lg font-semibold text-teal-950 hover:text-teal-700">
                  <PhoneIcon className="text-gold-700" /> <span dir="ltr">{p.display}</span>
                </a>
              ))}
              <a href={whatsappUrl(site.whatsapp, tc("whatsappMessage"))} target="_blank" rel="noopener" className="flex items-center gap-3 text-lg font-semibold text-teal-950 hover:text-teal-700">
                <WhatsAppIcon className="text-whatsapp" /> {tc("whatsapp")}
              </a>
              <p className="flex items-start gap-3 text-ink-soft">
                <MapPinIcon className="mt-1 shrink-0 text-gold-700" />
                <span>
                  {site.address.street}, {site.address.postalCode} {site.address.district}/{site.address.city}
                  <br />
                  <a href={site.address.mapsUrl} target="_blank" rel="noopener" className="text-teal-700 underline underline-offset-4">
                    {tc("openInMaps")}
                  </a>
                </span>
              </p>
              <p className="text-sm text-muted">{tc("languagesNote")}</p>
            </div>
          </div>
          <div className="card">
            <ContactForm />
          </div>
        </div>
      </Section>

      <JsonLd
        data={[
          localBusinessJsonLd({
            locale,
            site,
            description: messages.meta.defaultDescription,
            serviceNames: [
              messages.pages.outbound.title,
              messages.pages.inbound.title,
              messages.pages.transit.title,
              messages.pages.domestic.title,
            ],
            countryNames: countryIds.map((id) => messages.countries[id].name),
          }),
          faqJsonLd(faq),
          ...reviewsJsonLd(reviews),
        ]}
      />
    </>
  );
}
