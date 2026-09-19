import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { readStore } from "@/lib/store";
import { applyOverrides } from "@/lib/content";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const base = (await import(`../../messages/${locale}.json`)).default;
  const store = await readStore();
  const messages = applyOverrides(base, store.content[locale]);

  return {
    locale,
    messages,
    timeZone: "Europe/Istanbul",
  };
});
