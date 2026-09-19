import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { Callout, ContactAside, CtaBand, InfoBlock, PageHeader, Section, TwoColumn } from "@/components/ui";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "pages.nonMuslim" });
  return pageMetadata({ locale, pathname: "/non-muslim", title: t("title"), description: t("description") });
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const p = messages.pages.nonMuslim;
  const nav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={p.title}
        intro={p.intro}
        eyebrow={nav("services")}
        crumbs={[{ name: nav("services"), href: "/services" }, { name: p.title }]}
        crumbUrls={[absoluteUrl(locale, "/services"), absoluteUrl(locale, "/non-muslim")]}
      />
      <Section>
        <TwoColumn
          main={
            <div className="space-y-6">
              {p.sections.map((s, i) => (
                <InfoBlock key={i} title={s.title} items={s.items} tone={i % 2 ? "paper" : "white"} />
              ))}
              <div>
                <h2 className="text-2xl text-teal-950">{p.notesTitle}</h2>
                <div className="mt-4 space-y-3">
                  {p.notes.map((n, i) => (
                    <Callout key={i} text={n} tone={i === 0 ? "gold" : "teal"} />
                  ))}
                </div>
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
