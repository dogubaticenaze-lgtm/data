import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";
import { ServicePage } from "@/components/ServicePage";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "pages.domestic" });
  return pageMetadata({ locale, pathname: "/domestic-transfer", title: t("title"), description: t("description") });
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  return <ServicePage locale={locale} serviceKey="domestic" />;
}
