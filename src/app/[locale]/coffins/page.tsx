import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { ContactAside, CtaBand, PageHeader, Section, TwoColumn } from "@/components/ui";
import { ShieldIcon, SnowflakeIcon, UsersIcon, DocumentIcon } from "@/components/icons";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "pages.coffins" });
  return pageMetadata({ locale, pathname: "/coffins", title: t("title"), description: t("description") });
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const p = messages.pages.coffins;
  const nav = await getTranslations("nav");
  const icons = [ShieldIcon, DocumentIcon, UsersIcon, SnowflakeIcon];

  return (
    <>
      <PageHeader
        title={p.title}
        intro={p.intro}
        eyebrow={nav("services")}
        crumbs={[{ name: nav("services"), href: "/services" }, { name: p.title }]}
        crumbUrls={[absoluteUrl(locale, "/services"), absoluteUrl(locale, "/coffins")]}
      />
      <Section>
        <TwoColumn
          main={
            <div className="grid gap-5 sm:grid-cols-2">
              {p.items.map((item, i) => {
                const Icon = icons[i % icons.length];
                return (
                  <div key={i} className="card">
                    <Icon className="text-teal-700" size={26} />
                    <h2 className="mt-4 text-lg text-teal-950">{item.title}</h2>
                    <p className="mt-2 text-ink-soft">{item.text}</p>
                  </div>
                );
              })}
            </div>
          }
          aside={<ContactAside />}
        />
      </Section>
      <CtaBand title={messages.home.contactTitle} text={messages.home.contactText} />
    </>
  );
}
