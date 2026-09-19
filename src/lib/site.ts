import { site as defaults } from "@/config/site";
import { readStore, type Flags, type SettingsOverrides } from "./store";

export type SiteConfig = {
  domain: string;
  url: string;
  legalName: string;
  brandName: string;
  phones: { display: string; e164: string; primary: boolean }[];
  whatsapp: string;
  email: string;
  address: {
    street: string;
    district: string;
    city: string;
    postalCode: string;
    countryCode: string;
    geo: null | { lat: number; lng: number };
    mapsUrl: string;
  };
  facts: { foundedYear: number | null; completedTransfers: number | null; countriesServed: number | null };
  registry: {
    taxOffice: string | null;
    taxNumber: string | null;
    mersis: string | null;
    tradeRegistry: string | null;
    kep: string | null;
    hosting: string | null;
  };
  sameAs: string[];
  ogImage: string;
  flags: Flags;
};

function merge(o: SettingsOverrides, flags: Flags): SiteConfig {
  return {
    domain: defaults.domain,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? defaults.url,
    legalName: o.legalName?.trim() || defaults.legalName,
    brandName: defaults.brandName,
    phones: o.phones?.length ? o.phones : [...defaults.phones],
    whatsapp: o.whatsapp?.trim() || defaults.whatsapp,
    email: o.email?.trim() || defaults.email,
    address: {
      street: o.address?.street?.trim() || defaults.address.street,
      district: o.address?.district?.trim() || defaults.address.district,
      city: o.address?.city?.trim() || defaults.address.city,
      postalCode: o.address?.postalCode?.trim() || defaults.address.postalCode,
      countryCode: defaults.address.countryCode,
      geo: o.address?.geo ?? defaults.address.geo,
      mapsUrl: o.address?.mapsUrl?.trim() || defaults.address.mapsUrl,
    },
    facts: {
      foundedYear: o.facts?.foundedYear ?? defaults.facts.foundedYear,
      completedTransfers: o.facts?.completedTransfers ?? defaults.facts.completedTransfers,
      countriesServed: o.facts?.countriesServed ?? defaults.facts.countriesServed,
    },
    registry: {
      taxOffice: o.registry?.taxOffice ?? defaults.registry.taxOffice,
      taxNumber: o.registry?.taxNumber ?? defaults.registry.taxNumber,
      mersis: o.registry?.mersis ?? defaults.registry.mersis,
      tradeRegistry: o.registry?.tradeRegistry ?? defaults.registry.tradeRegistry,
      kep: o.registry?.kep ?? defaults.registry.kep,
      hosting: o.registry?.hosting ?? defaults.registry.hosting,
    },
    sameAs: o.sameAs?.length ? o.sameAs : [...defaults.sameAs],
    ogImage: defaults.ogImage,
    flags,
  };
}

/** Defaults from src/config/site.ts overlaid with what the admin panel saved. */
export async function getSite(): Promise<SiteConfig> {
  const store = await readStore();
  return merge(store.settings, store.flags);
}

export function whatsappUrl(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function telUrl(e164: string) {
  return `tel:${e164}`;
}
