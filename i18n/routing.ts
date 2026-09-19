import { defineRouting } from "next-intl/routing";

/**
 * Internal route keys are English; visitors see the localized pathnames.
 * Turkish lives at the root ("/"), other locales get a prefix.
 * Automatic locale detection is OFF on purpose (Google advises against it).
 * Arabic and Persian keep English slugs so links stay readable when shared.
 */
export const routing = defineRouting({
  locales: ["tr", "en", "ru", "ar", "fa", "de"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  localeDetection: false,
  alternateLinks: true,
  pathnames: {
    "/": "/",
    "/services": { tr: "/hizmetler", en: "/services", ru: "/uslugi", ar: "/services", fa: "/services", de: "/leistungen" },
    "/repatriation-from-turkey": {
      tr: "/yurt-disina-cenaze-nakli",
      en: "/repatriation-from-turkey",
      ru: "/perevozka-tela-iz-turcii",
      ar: "/repatriation-from-turkey",
      fa: "/repatriation-from-turkey",
      de: "/ueberfuehrung-aus-der-tuerkei",
    },
    "/repatriation-to-turkey": {
      tr: "/yurt-disindan-turkiyeye-cenaze-nakli",
      en: "/repatriation-to-turkey",
      ru: "/perevozka-tela-v-turciyu",
      ar: "/repatriation-to-turkey",
      fa: "/repatriation-to-turkey",
      de: "/ueberfuehrung-in-die-tuerkei",
    },
    "/transit": {
      tr: "/transit-cenaze-nakli",
      en: "/transit-repatriation",
      ru: "/tranzitnaya-perevozka",
      ar: "/transit-repatriation",
      fa: "/transit-repatriation",
      de: "/transit-ueberfuehrung",
    },
    "/domestic-transfer": {
      tr: "/yurt-ici-cenaze-nakli",
      en: "/domestic-transfer",
      ru: "/perevozka-po-turcii",
      ar: "/domestic-transfer",
      fa: "/domestic-transfer",
      de: "/inlandsueberfuehrung",
    },
    "/documents": {
      tr: "/evrak-ve-konsolosluk",
      en: "/documents-and-consulate",
      ru: "/dokumenty-i-konsulstvo",
      ar: "/documents-and-consulate",
      fa: "/documents-and-consulate",
      de: "/dokumente-und-konsulat",
    },
    "/process": { tr: "/surec", en: "/process", ru: "/process", ar: "/process", fa: "/process", de: "/ablauf" },
    "/what-to-do": {
      tr: "/vefat-oldu-ne-yapmaliyim",
      en: "/someone-died-in-turkey",
      ru: "/smert-v-turcii-chto-delat",
      ar: "/someone-died-in-turkey",
      fa: "/someone-died-in-turkey",
      de: "/todesfall-in-der-tuerkei",
    },
    "/countries": { tr: "/ulkeler", en: "/countries", ru: "/strany", ar: "/countries", fa: "/countries", de: "/laender" },
    "/countries/[slug]": {
      tr: "/ulkeler/[slug]",
      en: "/countries/[slug]",
      ru: "/strany/[slug]",
      ar: "/countries/[slug]",
      fa: "/countries/[slug]",
      de: "/laender/[slug]",
    },
    "/coffins": {
      tr: "/tabut-ve-hazirlik",
      en: "/coffins-and-preparation",
      ru: "/groby-i-podgotovka",
      ar: "/coffins-and-preparation",
      fa: "/coffins-and-preparation",
      de: "/saerge-und-vorbereitung",
    },
    "/partners": { tr: "/kurumsal", en: "/partners", ru: "/partneram", ar: "/partners", fa: "/partners", de: "/partner" },
    "/about": { tr: "/hakkimizda", en: "/about", ru: "/o-nas", ar: "/about", fa: "/about", de: "/ueber-uns" },
    "/contact": { tr: "/iletisim", en: "/contact", ru: "/kontakty", ar: "/contact", fa: "/contact", de: "/kontakt" },
    "/faq": { tr: "/sss", en: "/faq", ru: "/faq", ar: "/faq", fa: "/faq", de: "/faq" },
    "/cost-guide": {
      tr: "/maliyet-rehberi",
      en: "/cost-guide",
      ru: "/stoimost",
      ar: "/cost-guide",
      fa: "/cost-guide",
      de: "/kosten",
    },
    "/non-muslim": {
      tr: "/musluman-olmayanlar-icin-hizmetler",
      en: "/non-muslim-services",
      ru: "/dlya-nemusulman",
      ar: "/non-muslim-services",
      fa: "/non-muslim-services",
      de: "/nicht-muslimische-bestattungen",
    },
    "/downloads": {
      tr: "/belgeler",
      en: "/downloads",
      ru: "/dokumenty-skachat",
      ar: "/downloads",
      fa: "/downloads",
      de: "/downloads",
    },
    "/guides": { tr: "/rehber", en: "/guides", ru: "/stati", ar: "/guides", fa: "/guides", de: "/ratgeber" },
    "/guides/[slug]": {
      tr: "/rehber/[slug]",
      en: "/guides/[slug]",
      ru: "/stati/[slug]",
      ar: "/guides/[slug]",
      fa: "/guides/[slug]",
      de: "/ratgeber/[slug]",
    },
    "/case-tracking": {
      tr: "/dosya-takip",
      en: "/case-tracking",
      ru: "/otslezhivanie",
      ar: "/case-tracking",
      fa: "/case-tracking",
      de: "/fallverfolgung",
    },
    "/privacy-notice": {
      tr: "/kvkk-aydinlatma-metni",
      en: "/privacy-notice",
      ru: "/privacy-notice",
      ar: "/privacy-notice",
      fa: "/privacy-notice",
      de: "/datenschutzhinweis",
    },
    "/cookie-policy": {
      tr: "/cerez-politikasi",
      en: "/cookie-policy",
      ru: "/cookie-policy",
      ar: "/cookie-policy",
      fa: "/cookie-policy",
      de: "/cookie-richtlinie",
    },
    "/privacy-policy": {
      tr: "/gizlilik-politikasi",
      en: "/privacy-policy",
      ru: "/privacy-policy",
      ar: "/privacy-policy",
      fa: "/privacy-policy",
      de: "/datenschutz",
    },
    "/imprint": { tr: "/kunye", en: "/imprint", ru: "/imprint", ar: "/imprint", fa: "/imprint", de: "/impressum" },
  },
});

export type AppLocale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
export type DynamicPathname = "/countries/[slug]" | "/guides/[slug]";
export type StaticPathname = Exclude<AppPathname, DynamicPathname>;
