import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { ContactAside, InfoBlock, PageHeader, Section, TwoColumn } from "@/components/ui";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "pages.partners" });
  return pageMetadata({ locale, pathname: "/partners", title: t("title"), description: t("description") });
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const p = messages.pages.partners;

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} crumbs={[{ name: p.title }]} crumbUrls={[absoluteUrl(locale, "/partners")]} />
      <Section>
        <TwoColumn
          main={
            <div className="space-y-8">
              <InfoBlock title={p.forTitle} items={p.for} />
              <InfoBlock title={p.offerTitle} items={p.offer} tone="paper" />
              <div className="card" id="corporate-form">
                <h2 className="text-2xl text-teal-950">{p.cta}</h2>
                <p className="mt-2 text-ink-soft">{p.formNote}</p>
                <div className="mt-6">
                  <ContactForm variant="corporate" />
                </div>
              </div>
            </div>
          }
          aside={<ContactAside />}
        />
      </Section>
    </>
  );
}
