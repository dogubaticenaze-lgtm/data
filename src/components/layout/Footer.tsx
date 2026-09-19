import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { getSite, telUrl, whatsappUrl } from "@/lib/site";
import { MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "../icons";
import { Logo } from "./Logo";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const tc = await getTranslations("common");
  const site = await getSite();
  const year = new Date().getFullYear();

  const pages: { href: StaticPathname; label: string }[] = [
    { href: "/repatriation-from-turkey", label: nav("outbound") },
    { href: "/repatriation-to-turkey", label: nav("inbound") },
    { href: "/transit", label: nav("transit") },
    { href: "/domestic-transfer", label: nav("domestic") },
    { href: "/documents", label: nav("documents") },
    { href: "/process", label: nav("process") },
    { href: "/what-to-do", label: nav("guide") },
    { href: "/countries", label: nav("countries") },
    { href: "/cost-guide", label: nav("costGuide") },
    { href: "/non-muslim", label: nav("nonMuslim") },
    { href: "/downloads", label: nav("downloads") },
    { href: "/guides", label: nav("guides") },
    { href: "/case-tracking", label: nav("tracking") },
    { href: "/partners", label: nav("partners") },
    { href: "/faq", label: nav("faq") },
  ];

  const legal: { href: StaticPathname; label: string }[] = [
    { href: "/privacy-notice", label: t("kvkk") },
    { href: "/cookie-policy", label: t("cookies") },
    { href: "/privacy-policy", label: t("privacy") },
    { href: "/imprint", label: t("imprint") },
  ];

  return (
    <footer className="bg-teal-950 text-teal-100">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <address className="mt-6 space-y-3 not-italic text-sm">
            <p className="flex gap-2">
              <MapPinIcon size={18} className="mt-0.5 shrink-0 text-gold-300" />
              <span>
                {site.address.street}, {site.address.postalCode} {site.address.district}/{site.address.city}
                <br />
                <a href={site.address.mapsUrl} target="_blank" rel="noopener" className="text-gold-300 underline-offset-4 hover:underline">
                  {tc("openInMaps")}
                </a>
              </span>
            </p>
            {site.phones.map((p) => (
              <p key={p.e164} className="flex gap-2">
                <PhoneIcon size={18} className="mt-0.5 shrink-0 text-gold-300" />
                <a href={telUrl(p.e164)} dir="ltr" className="hover:text-white">
                  {p.display}
                </a>
              </p>
            ))}
            <p className="flex gap-2">
              <WhatsAppIcon size={18} className="mt-0.5 shrink-0 text-gold-300" />
              <a href={whatsappUrl(site.whatsapp, tc("whatsappMessage"))} target="_blank" rel="noopener" className="hover:text-white">
                {tc("whatsapp")}
              </a>
            </p>
            <p className="flex gap-2">
              <MailIcon size={18} className="mt-0.5 shrink-0 text-gold-300" />
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </p>
            <p className="text-teal-100/70">
              {tc("hours")}: {tc("hoursValue")}
            </p>
          </address>
        </div>

        <nav aria-label={t("linksTitle")}>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-300">{t("linksTitle")}</h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 md:grid-cols-1">
            {pages.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="hover:text-white">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("legalTitle")}>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold-300">{t("legalTitle")}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {legal.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="hover:text-white">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
          {site.sameAs.length > 0 && (
            <ul className="mt-6 space-y-2 text-sm">
              {site.sameAs.map((u) => (
                <li key={u}>
                  <a href={u} target="_blank" rel="noopener" className="text-gold-300 hover:text-white">
                    {new URL(u).hostname.replace(/^www\./, "")}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-teal-100/70 md:flex-row md:justify-between">
          <p>{t("copyright", { year })}</p>
          <p className="max-w-xl">{t("disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
