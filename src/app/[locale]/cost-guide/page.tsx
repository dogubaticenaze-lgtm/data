import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { getSite } from "@/lib/site";
import { Callout, ContactAside, CtaBand, InfoBlock, PageHeader, Section, TwoColumn } from "@/components/ui";
import { ArrowIcon } from "@/components/icons";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "pages.costGuide" });
  return pageMetadata({ locale, pathname: "/cost-guide", title: t("title"), description: t("description") });
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const site = await getSite();
  const p = messages.pages.costGuide;
  const nav = await getTranslations("nav");
  const tc = await getTranslations("common");

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} crumbs={[{ name: p.title }]} crumbUrls={[absoluteUrl(locale, "/cost-guide")]} />
      <Section>
        <TwoColumn
          main={
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl text-teal-950">{p.itemsTitle}</h2>
                <ol className="mt-5 grid gap-4 sm:grid-cols-2">
                  {p.items.map((it, i) => (
                    <li key={i} className="card">
                      <span className="flex size-8 items-center justify-center rounded-full bg-teal-950 text-sm font-semibold text-gold-300">{i + 1}</span>
                      <h3 className="mt-3 text-lg text-teal-950">{it.title}</h3>
                      <p className="mt-1.5 text-ink-soft">{it.text}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {site.flags.showPriceRanges && (
                <div>
                  <h2 className="text-2xl text-teal-950">{p.rangesTitle}</h2>
                  <p className="mt-2 text-sm text-muted">{p.rangesNote}</p>
                  <div className="mt-4 overflow-x-auto rounded-card border border-line">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-line">
                        {p.ranges.map((r, i) => (
                          <tr key={i} className="bg-white">
                            <th scope="row" className="px-4 py-3 text-start font-medium text-ink">{r.route}</th>
                            <td className="whitespace-nowrap px-4 py-3 text-teal-900" dir="ltr">{r.range}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <InfoBlock title={p.whoPaysTitle} items={p.whoPays} tone="paper" />
              <InfoBlock title={p.includedTitle} items={p.included} />
              <Callout text={p.cta} tone="teal" />
              <p className="text-sm text-muted">{tc("disclaimerCost")}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn-secondary">
                  {tc("requestQuote")} <ArrowIcon size={18} />
                </Link>
                <Link href="/faq" className="btn-outline">
                  {nav("faq")} <ArrowIcon size={18} />
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
