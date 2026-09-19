import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSite, telUrl } from "@/lib/site";
import { countrySlugs } from "@/lib/countries";
import { PhoneIcon } from "../icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav, type NavLink } from "./MobileNav";
import { Logo } from "./Logo";

export async function Header() {
  const t = await getTranslations("nav");
  const tc = await getTranslations("common");
  const site = await getSite();

  const primary: NavLink[] = [
    { href: "/services", label: t("services") },
    { href: "/process", label: t("process") },
    { href: "/countries", label: t("countries") },
    { href: "/cost-guide", label: t("costGuide") },
    { href: "/partners", label: t("partners") },
    { href: "/contact", label: t("contact") },
  ];
  const all: NavLink[] = [
    { href: "/", label: t("home") },
    { href: "/repatriation-from-turkey", label: t("outbound") },
    { href: "/repatriation-to-turkey", label: t("inbound") },
    { href: "/transit", label: t("transit") },
    { href: "/domestic-transfer", label: t("domestic") },
    { href: "/documents", label: t("documents") },
    { href: "/process", label: t("process") },
    { href: "/what-to-do", label: t("guide") },
    { href: "/countries", label: t("countries") },
    { href: "/cost-guide", label: t("costGuide") },
    { href: "/coffins", label: t("coffins") },
    { href: "/non-muslim", label: t("nonMuslim") },
    { href: "/downloads", label: t("downloads") },
    { href: "/guides", label: t("guides") },
    { href: "/case-tracking", label: t("tracking") },
    { href: "/partners", label: t("partners") },
    { href: "/about", label: t("about") },
    { href: "/faq", label: t("faq") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-teal-950/95 text-white backdrop-blur supports-[backdrop-filter]:bg-teal-950/85">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-teal-950"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 xl:shrink-0" aria-label={site.legalName}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {primary.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-teal-50 hover:bg-white/10 hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <LanguageSwitcher slugMap={countrySlugs} />
          <a href={telUrl(site.phones[0].e164)} className="btn-primary min-h-10 whitespace-nowrap px-4 py-2 text-sm">
            <PhoneIcon size={18} /> {tc("call247")}
          </a>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <a
            href={telUrl(site.phones[0].e164)}
            className="inline-flex size-11 items-center justify-center rounded-full bg-gold-400 text-teal-950"
            aria-label={tc("call247")}
          >
            <PhoneIcon size={22} />
          </a>
          <MobileNav links={all} labels={{ menu: t("menu"), close: t("close") }}>
            <LanguageSwitcher slugMap={countrySlugs} variant="stack" />
          </MobileNav>
        </div>
      </div>
    </header>
  );
}
