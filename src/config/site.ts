/**
 * Default site facts. The admin panel can override most of them (see src/lib/site.ts);
 * what is stored here is the fallback that ships with the code.
 * Items marked `null` are unknown until the owner confirms them.
 */
export const site = {
  domain: "dogubaticenaze.com",
  url: "https://dogubaticenaze.com",
  legalName: "Doğu Batı Uluslararası Cenaze Hizmetleri",
  brandName: "Doğu Batı",
  phones: [
    { display: "+90 534 450 48 62", e164: "+905344504862", primary: true },
    { display: "+90 543 218 90 81", e164: "+905432189081", primary: false },
  ],
  /** WhatsApp number in international format without "+" (wa.me requirement). */
  whatsapp: "905344504862",
  email: "info@dogubaticenaze.com",
  address: {
    street: "Merkez Mh. Çukurçeşme Cad. Serhat Sok. No:2 D:17",
    district: "Gaziosmanpaşa",
    city: "İstanbul",
    postalCode: "34200",
    countryCode: "TR",
    geo: null as null | { lat: number; lng: number },
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Merkez+Mh.+%C3%87ukur%C3%A7e%C5%9Fme+Cad.+Serhat+Sok.+No:2+Gaziosmanpa%C5%9Fa+%C4%B0stanbul",
  },
  facts: {
    foundedYear: null as null | number,
    completedTransfers: null as null | number,
    countriesServed: null as null | number,
  },
  registry: {
    taxOffice: null as null | string,
    taxNumber: null as null | string,
    mersis: null as null | string,
    tradeRegistry: null as null | string,
    kep: null as null | string,
    hosting: null as null | string,
  },
  sameAs: [] as string[],
  ogImage: "/og.png",
} as const;

export type Locale = "tr" | "en" | "ru" | "ar" | "fa" | "de" | "fr";

export const localeMeta: Record<
  Locale,
  { label: string; dir: "ltr" | "rtl"; ogLocale: string; hreflang: string; font: "latin" | "arabic" | "persian" }
> = {
  tr: { label: "Türkçe", dir: "ltr", ogLocale: "tr_TR", hreflang: "tr", font: "latin" },
  en: { label: "English", dir: "ltr", ogLocale: "en_GB", hreflang: "en", font: "latin" },
  ru: { label: "Русский", dir: "ltr", ogLocale: "ru_RU", hreflang: "ru", font: "latin" },
  ar: { label: "العربية", dir: "rtl", ogLocale: "ar_AR", hreflang: "ar", font: "arabic" },
  fa: { label: "فارسی", dir: "rtl", ogLocale: "fa_IR", hreflang: "fa", font: "persian" },
  de: { label: "Deutsch", dir: "ltr", ogLocale: "de_DE", hreflang: "de", font: "latin" },
  fr: { label: "Français", dir: "ltr", ogLocale: "fr_FR", hreflang: "fr", font: "latin" },
};

export const countryIds = [
  "germany",
  "united-kingdom",
  "russia",
  "iran",
  "iraq",
  "azerbaijan",
  "netherlands",
  "france",
  "belgium",
  "austria",
  "saudi-arabia",
  "kazakhstan",
  "uzbekistan",
  "turkmenistan",
  "syria",
  "libya",
] as const;
export type CountryId = (typeof countryIds)[number];

/** ISO 3166-1 alpha-2 for schema.org areaServed. */
export const countryIso: Record<CountryId, string> = {
  germany: "DE",
  "united-kingdom": "GB",
  russia: "RU",
  iran: "IR",
  iraq: "IQ",
  azerbaijan: "AZ",
  netherlands: "NL",
  france: "FR",
  belgium: "BE",
  austria: "AT",
  "saudi-arabia": "SA",
  kazakhstan: "KZ",
  uzbekistan: "UZ",
  turkmenistan: "TM",
  syria: "SY",
  libya: "LY",
};
