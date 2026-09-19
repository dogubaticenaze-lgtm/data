import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { getSite } from "@/lib/site";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/ui";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "legal.imprint" });
  return { ...pageMetadata({ locale, pathname: "/imprint", title: t("title"), description: t("description") }), robots: { index: false, follow: true } };
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const p = messages.legal.imprint;
  const footer = await getTranslations("footer");
  const site = await getSite();
  const a = site.address;

  const rows: { label: string; value: string | null; ltr?: boolean }[] = [
    { label: p.labels.legalName, value: site.legalName },
    { label: p.labels.address, value: `${a.street}, ${a.postalCode} ${a.district} / ${a.city}` },
    { label: p.labels.phone, value: site.phones.map((ph) => ph.display).join(" · "), ltr: true },
    { label: p.labels.email, value: site.email, ltr: true },
    { label: p.labels.taxId, value: site.registry.taxOffice && site.registry.taxNumber ? `${site.registry.taxOffice} / ${site.registry.taxNumber}` : null },
    { label: p.labels.mersis, value: site.registry.mersis },
    { label: p.labels.tradeRegistry, value: site.registry.tradeRegistry },
    { label: p.labels.kep, value: site.registry.kep },
    { label: p.labels.hosting, value: site.registry.hosting },
  ];

  return (
    <>
      <PageHeader title={p.title} eyebrow={footer("legalTitle")} crumbs={[{ name: p.title }]} crumbUrls={[absoluteUrl(locale, "/imprint")]} />
      <Section>
        <p className="prose-site max-w-3xl">{p.intro}</p>
        <dl className="mt-8 max-w-3xl divide-y divide-line rounded-card border border-line bg-white">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[14rem_1fr]">
              <dt className="text-sm font-medium text-muted">{r.label}</dt>
              <dd className={r.value ? "text-ink" : "italic text-gold-700"} dir={r.ltr ? "ltr" : undefined}>
                {r.value ?? p.pending}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
