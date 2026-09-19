import { getMessages, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale, StaticPathname } from "@/i18n/routing";
import { absoluteUrl, serviceJsonLd } from "@/lib/seo";
import { getSite } from "@/lib/site";
import { JsonLd } from "./JsonLd";
import { Callout, ContactAside, CtaBand, InfoBlock, PageHeader, Section, TwoColumn } from "./ui";
import { ArrowIcon } from "./icons";

export type ServiceKey = "outbound" | "inbound" | "transit" | "domestic";

export const servicePaths: Record<ServiceKey, StaticPathname> = {
  outbound: "/repatriation-from-turkey",
  inbound: "/repatriation-to-turkey",
  transit: "/transit",
  domestic: "/domestic-transfer",
};

export async function ServicePage({ locale, serviceKey }: { locale: AppLocale; serviceKey: ServiceKey }) {
  const messages = await getMessages();
  const site = await getSite();
  const page = messages.pages[serviceKey];
  const tc = await getTranslations("common");
  const nav = await getTranslations("nav");
  const pathname = servicePaths[serviceKey];

  const related: { href: StaticPathname; label: string }[] = [
    ...(Object.keys(servicePaths) as ServiceKey[])
      .filter((k) => k !== serviceKey)
      .map((k) => ({ href: servicePaths[k], label: nav(k) })),
    { href: "/documents", label: nav("documents") },
    { href: "/process", label: nav("process") },
    { href: "/cost-guide", label: nav("costGuide") },
  ];

  return (
    <>
      <PageHeader
        title={page.title}
        intro={page.intro}
        eyebrow={nav("services")}
        crumbs={[{ name: nav("services"), href: "/services" }, { name: page.title }]}
        crumbUrls={[absoluteUrl(locale, "/services"), absoluteUrl(locale, pathname)]}
      />

      <Section>
        <TwoColumn
          main={
            <div className="space-y-8">
              <InfoBlock title={tc("whatToExpect")} items={page.expect} />
              <InfoBlock title={tc("whatWeNeed")} items={page.need} tone="paper" />
              <div>
                <h2 className="text-2xl text-teal-950">{tc("howLong")}</h2>
                <p className="prose-site mt-3">{page.time}</p>
                <p className="mt-3 text-sm text-muted">{tc("disclaimerTimes")}</p>
              </div>

              {"included" in page && (
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoBlock title={tc("included")} items={page.included} />
                  <InfoBlock title={tc("notIncluded")} items={page.notIncluded} tone="paper" />
                </div>
              )}
              {"costTitle" in page && <Callout title={page.costTitle} text={page.costText} />}
              {"fundTitle" in page && <Callout title={page.fundTitle} text={page.fundText} tone="teal" />}
              {"municipalNote" in page && <Callout text={page.municipalNote} tone="teal" />}
              <p className="text-sm text-muted">{tc("disclaimerCost")}</p>
            </div>
          }
          aside={
            <>
              <ContactAside />
              <nav aria-label={nav("services")} className="card">
                <p className="eyebrow">{nav("services")}</p>
                <ul className="mt-3 space-y-2">
                  {related.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className="flex items-center justify-between gap-2 py-1 text-teal-900 hover:text-teal-700">
                        {r.label} <ArrowIcon size={16} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </>
          }
        />
      </Section>

      <CtaBand title={messages.home.contactTitle} text={messages.home.contactText} />

      <JsonLd data={serviceJsonLd({ locale, pathname, name: page.title, description: page.description, phone: site.phones[0].e164 })} />
    </>
  );
}
