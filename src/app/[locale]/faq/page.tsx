import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { absoluteUrl, faqJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ContactAside, CtaBand, PageHeader, Section, TwoColumn } from "@/components/ui";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "pages.faq" });
  return pageMetadata({ locale, pathname: "/faq", title: t("title"), description: t("description") });
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const p = messages.pages.faq;

  return (
    <>
      <PageHeader title={p.title} crumbs={[{ name: p.title }]} crumbUrls={[absoluteUrl(locale, "/faq")]} />
      <Section>
        <TwoColumn
          main={
            <div className="space-y-3">
              {p.items.map((item, i) => (
                <details key={i} className="group rounded-card border border-line bg-white p-5 open:shadow-card" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-teal-950 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span aria-hidden="true" className="text-gold-700 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="prose-site mt-3">{item.a}</p>
                </details>
              ))}
            </div>
          }
          aside={<ContactAside />}
        />
      </Section>
      <CtaBand title={messages.home.contactTitle} text={messages.home.contactText} />
      <JsonLd data={faqJsonLd(p.items)} />
    </>
  );
}
