import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { Callout, ContactAside, CtaBand, InfoBlock, PageHeader, Section, TwoColumn } from "@/components/ui";
import { ArrowIcon } from "@/components/icons";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "pages.guide" });
  return pageMetadata({ locale, pathname: "/what-to-do", title: t("title"), description: t("description") });
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const p = messages.pages.guide;
  const nav = await getTranslations("nav");

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} crumbs={[{ name: p.title }]} crumbUrls={[absoluteUrl(locale, "/what-to-do")]} />
      <Section>
        <TwoColumn
          main={
            <div className="space-y-6">
              {p.sections.map((s, i) => (
                <InfoBlock key={i} title={s.title} items={s.items} tone={i % 2 ? "paper" : "white"} />
              ))}
              <div className="rounded-card border border-gold-500/40 bg-gold-100/60 p-6">
                <h2 className="text-lg text-teal-950">{p.dontTitle}</h2>
                <ul className="mt-3 list-disc space-y-2 ps-5 text-ink-soft">
                  {p.dont.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
              <Callout text={p.cta} tone="teal" />
              <div className="flex flex-wrap gap-3">
                <Link href="/repatriation-from-turkey" className="btn-outline">
                  {nav("outbound")} <ArrowIcon size={18} />
                </Link>
                <Link href="/repatriation-to-turkey" className="btn-outline">
                  {nav("inbound")} <ArrowIcon size={18} />
                </Link>
              </div>
            </div>
          }
          aside={<ContactAside />}
        />
      </Section>
      <CtaBand title={messages.home.contactTitle} text={messages.home.contactText} />
    </>
  );
}
