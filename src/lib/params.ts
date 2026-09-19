import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";

export type LocaleParams = { params: Promise<{ locale: string }> };
export type SlugParams = { params: Promise<{ locale: string; slug: string }> };

/** Validates the [locale] segment and enables static rendering for the request. */
export async function resolveLocale(params: LocaleParams["params"]): Promise<AppLocale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}

export async function localeOf(params: LocaleParams["params"]): Promise<AppLocale> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
