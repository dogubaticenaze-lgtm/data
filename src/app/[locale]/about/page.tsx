import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { Callout, ContactAside, CtaBand, PageHeader, Section, TwoColumn } from "@/components/ui";
import { DocumentIcon, ShieldIcon, TruckIcon, UsersIcon } from "@/components/icons";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return pageMetadata({ locale, pathname: "/about", title: t("title"), description: t("description") });
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const p = messages.pages.about;
  const icons = [ShieldIcon, DocumentIcon, UsersIcon, TruckIcon];

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} crumbs={[{ name: p.title }]} crumbUrls={[absoluteUrl(locale, "/about")]} />
      <Section>
        <TwoColumn
          main={
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl text-teal-950">{p.valuesTitle}</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {p.values.map((v, i) => {
                    const Icon = icons[i % icons.length];
                    return (
                      <div key={i} className="card">
                        <Icon className="text-teal-700" size={24} />
                        <h3 className="mt-3 text-lg text-teal-950">{v.title}</h3>
                        <p className="mt-1.5 text-ink-soft">{v.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h2 className="text-2xl text-teal-950">{p.fleetTitle}</h2>
                <p className="prose-site mt-3">{p.fleetText}</p>
              </div>
              <Callout title={p.documentsTitle} text={p.documentsText} tone="teal" />
            </div>
          }
          aside={<ContactAside />}
        />
      </Section>
      <CtaBand title={messages.home.contactTitle} text={messages.home.contactText} />
    </>
  );
}
