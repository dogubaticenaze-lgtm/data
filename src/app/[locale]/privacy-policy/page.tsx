import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "legal.privacy" });
  return { ...pageMetadata({ locale, pathname: "/privacy-policy", title: t("title"), description: t("description") }), robots: { index: false, follow: true } };
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  return <LegalPage locale={locale} legalKey="privacy" />;
}
