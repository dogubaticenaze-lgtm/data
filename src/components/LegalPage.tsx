import { getMessages, getTranslations } from "next-intl/server";
import type { AppLocale, StaticPathname } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";
import { PageHeader, Section } from "./ui";

export type LegalKey = "kvkk" | "cookies" | "privacy";
type StaticPath = StaticPathname;

export const legalPaths: Record<LegalKey, StaticPath> = {
  kvkk: "/privacy-notice",
  cookies: "/cookie-policy",
  privacy: "/privacy-policy",
};

export async function LegalPage({ locale, legalKey }: { locale: AppLocale; legalKey: LegalKey }) {
  const messages = await getMessages();
  const page = messages.legal[legalKey];
  const footer = await getTranslations("footer");
  return (
    <>
      <PageHeader
        title={page.title}
        eyebrow={footer("legalTitle")}
        crumbs={[{ name: page.title }]}
        crumbUrls={[absoluteUrl(locale, legalPaths[legalKey])]}
      />
      <Section>
        <div className="prose-site max-w-3xl space-y-8">
          {page.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl text-teal-950">{s.title}</h2>
              <p className="mt-2">{s.text}</p>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
