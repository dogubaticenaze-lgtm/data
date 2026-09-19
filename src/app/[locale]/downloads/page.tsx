import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { Callout, ContactAside, CtaBand, PageHeader, Section, TwoColumn } from "@/components/ui";
import { DocumentIcon } from "@/components/icons";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "pages.downloads" });
  return pageMetadata({ locale, pathname: "/downloads", title: t("title"), description: t("description") });
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const p = messages.pages.downloads;
  const tc = await getTranslations("common");

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} crumbs={[{ name: p.title }]} crumbUrls={[absoluteUrl(locale, "/downloads")]} />
      <Section>
        <TwoColumn
          main={
            <div className="space-y-6">
              {p.items.map((item, i) => (
                <div key={i} className="card">
                  <DocumentIcon className="text-teal-700" size={28} />
                  <h2 className="mt-3 text-xl text-teal-950">{item.title}</h2>
                  <p className="mt-2 text-ink-soft">{item.text}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {item.files.map((f) => (
                      <a key={f.href} href={f.href} download className="btn-outline min-h-10 text-sm">
                        {tc("download")}: {f.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              <Callout text={p.note} tone="teal" />
            </div>
          }
          aside={<ContactAside />}
        />
      </Section>
      <CtaBand title={messages.home.contactTitle} text={messages.home.contactText} />
    </>
  );
}
