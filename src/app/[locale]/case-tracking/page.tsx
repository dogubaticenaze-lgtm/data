import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { localeOf, resolveLocale } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { getSite } from "@/lib/site";
import { readStore, type CaseStatus } from "@/lib/store";
import { Callout, ContactAside, CtaBand, PageHeader, Section, TwoColumn, formatDate } from "@/components/ui";
import { CheckIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ code?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "pages.tracking" });
  return { ...pageMetadata({ locale, pathname: "/case-tracking", title: t("title"), description: t("description") }), robots: { index: true, follow: true } };
}

const ORDER: CaseStatus[] = ["received", "documents", "preparation", "consulate", "flight", "delivered"];

export default async function Page({ params, searchParams }: Props) {
  const locale = await resolveLocale(params);
  const { code } = await searchParams;
  const messages = await getMessages();
  const site = await getSite();
  const p = messages.pages.tracking;
  const store = await readStore();
  const query = (code ?? "").trim().toUpperCase();
  const found = query ? store.cases.find((c) => c.code.toUpperCase() === query) ?? null : null;

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} crumbs={[{ name: p.title }]} crumbUrls={[absoluteUrl(locale, "/case-tracking")]} />
      <Section>
        <TwoColumn
          main={
            <div className="space-y-6">
              {site.flags.showCaseTracking ? (
                <form method="get" className="card flex flex-col gap-3 sm:flex-row sm:items-end">
                  <label className="flex-1 text-sm font-medium text-ink">
                    {p.codeLabel}
                    <input
                      name="code"
                      defaultValue={code ?? ""}
                      placeholder={p.codePlaceholder}
                      dir="ltr"
                      autoComplete="off"
                      className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 font-mono uppercase tracking-wide text-ink focus:border-teal-700"
                    />
                  </label>
                  <button type="submit" className="btn-secondary">
                    {p.submit}
                  </button>
                </form>
              ) : (
                <Callout text={p.notFound} tone="teal" />
              )}

              {query && !found && site.flags.showCaseTracking && <Callout text={p.notFound} tone="gold" />}

              {found && (
                <div className="card">
                  <dl className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <dt className="text-sm text-muted">{p.codeLabel}</dt>
                      <dd className="font-mono font-semibold text-teal-950" dir="ltr">{found.code}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted">{p.routeLabel}</dt>
                      <dd className="font-semibold text-teal-950">{found.route}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted">{p.updatedLabel}</dt>
                      <dd className="font-semibold text-teal-950">{formatDate(found.updatedAt, locale)}</dd>
                    </div>
                  </dl>

                  <ol className="mt-6 space-y-2">
                    {ORDER.map((s, i) => {
                      const currentIdx = ORDER.indexOf(found.status);
                      const done = i < currentIdx;
                      const current = i === currentIdx;
                      return (
                        <li
                          key={s}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 ${current ? "bg-teal-50 font-semibold text-teal-950" : done ? "text-ink-soft" : "text-muted"}`}
                          aria-current={current ? "step" : undefined}
                        >
                          <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${done || current ? "bg-teal-700 text-white" : "border border-line"}`}>
                            {done ? <CheckIcon size={16} /> : i + 1}
                          </span>
                          {p.statuses[s]}
                        </li>
                      );
                    })}
                  </ol>
                  {found.note && <p className="mt-4 text-ink-soft">{found.note}</p>}

                  {found.updates.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">{p.historyLabel}</h2>
                      <ul className="mt-2 divide-y divide-line text-sm">
                        {found.updates
                          .slice()
                          .reverse()
                          .map((u, i) => (
                            <li key={i} className="flex flex-col gap-1 py-2 sm:flex-row sm:gap-4">
                              <span className="shrink-0 text-muted">{formatDate(u.at, locale)}</span>
                              <span>
                                <span className="font-medium text-teal-950">{p.statuses[u.status]}</span>
                                {u.note ? ` - ${u.note}` : ""}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              <p className="text-sm text-muted">{p.privacyNote}</p>
            </div>
          }
          aside={<ContactAside />}
        />
      </Section>
      <CtaBand title={messages.home.contactTitle} text={messages.home.contactText} />
    </>
  );
}
