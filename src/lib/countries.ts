import tr from "../../messages/tr.json";
import en from "../../messages/en.json";
import ru from "../../messages/ru.json";
import ar from "../../messages/ar.json";
import fa from "../../messages/fa.json";
import de from "../../messages/de.json";
import { countryIds, type CountryId } from "@/config/site";
import type { AppLocale } from "@/i18n/routing";

const messagesByLocale = { tr, en, ru, ar, fa, de } as const;

/** locale → countryId → localized slug */
export const countrySlugs: Record<AppLocale, Record<CountryId, string>> = Object.fromEntries(
  (Object.keys(messagesByLocale) as AppLocale[]).map((locale) => [
    locale,
    Object.fromEntries(countryIds.map((id) => [id, messagesByLocale[locale].countries[id].slug])),
  ]),
) as Record<AppLocale, Record<CountryId, string>>;

export function countryIdFromSlug(locale: AppLocale, slug: string): CountryId | undefined {
  return countryIds.find((id) => countrySlugs[locale][id] === slug);
}

export function slugsForCountry(id: CountryId): Record<AppLocale, string> {
  return Object.fromEntries(
    (Object.keys(countrySlugs) as AppLocale[]).map((l) => [l, countrySlugs[l][id]]),
  ) as Record<AppLocale, string>;
}
