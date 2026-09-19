import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { getSite, telUrl, whatsappUrl } from "@/lib/site";
import { PhoneIcon, WhatsAppIcon } from "./icons";
import { JsonLd } from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export function Section({
  children,
  className = "",
  tone = "white",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "paper" | "teal";
  id?: string;
}) {
  const tones = { white: "bg-white", paper: "bg-paper", teal: "bg-teal-950 text-white" };
  return (
    <section id={id} className={`${tones[tone]} py-14 sm:py-20 ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  light = false,
  align = "start",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  light?: boolean;
  align?: "start" | "center";
}) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} mb-10`}>
      {eyebrow && <p className={`eyebrow mb-3 ${light ? "text-gold-300" : ""}`}>{eyebrow}</p>}
      <h2 className={`text-3xl sm:text-4xl ${light ? "text-white" : "text-teal-950"}`}>{title}</h2>
      {text && <p className={`mt-4 text-lg ${light ? "text-teal-100/90" : "text-ink-soft"}`}>{text}</p>}
    </div>
  );
}

type Crumb = { name: string; href?: StaticPathname };

export async function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = await getTranslations("common");
  const all: Crumb[] = [{ name: t("breadcrumbHome"), href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-teal-100/80">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className="hover:text-white">
                {c.name}
              </Link>
            ) : (
              <span aria-current={i === all.length - 1 ? "page" : undefined}>{c.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Dark page header used by every inner page. */
export async function PageHeader({
  title,
  intro,
  eyebrow,
  crumbs,
  crumbUrls,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  crumbs: Crumb[];
  /** Absolute URLs for BreadcrumbList JSON-LD, same order as crumbs (home is added). */
  crumbUrls: string[];
}) {
  const t = await getTranslations("common");
  const site = await getSite();
  return (
    <header className="bg-teal-950 text-white">
      <div className="container-x py-12 sm:py-16">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <p className="eyebrow mt-6 text-gold-300">{eyebrow}</p>}
        <h1 className="mt-3 max-w-4xl text-3xl sm:text-5xl">{title}</h1>
        {intro && <p className="mt-5 max-w-3xl text-lg text-teal-100/90">{intro}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={telUrl(site.phones[0].e164)} className="btn-primary">
            <PhoneIcon /> {t("call247")}
          </a>
          <a href={whatsappUrl(site.whatsapp, t("whatsappMessage"))} className="btn-ghost-light" target="_blank" rel="noopener">
            <WhatsAppIcon /> {t("whatsapp")}
          </a>
        </div>
      </div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("breadcrumbHome"), url: site.url + "/" },
          ...crumbs.map((c, i) => ({ name: c.name, url: crumbUrls[i] })),
        ])}
      />
    </header>
  );
}

export function InfoBlock({ title, items, tone = "white" }: { title: string; items: string[]; tone?: "white" | "paper" }) {
  return (
    <div className={`rounded-card border border-line p-6 ${tone === "paper" ? "bg-paper" : "bg-white"}`}>
      <h3 className="text-lg text-teal-950">{title}</h3>
      <ul className="list-check mt-4 space-y-2.5 text-ink-soft">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export function Callout({ title, text, tone = "gold" }: { title?: string; text: string; tone?: "gold" | "teal" }) {
  const cls = tone === "gold" ? "border-gold-500/40 bg-gold-100/60 text-ink" : "border-teal-700/30 bg-teal-50 text-teal-950";
  return (
    <div className={`rounded-card border p-5 ${cls}`}>
      {title && <p className="font-semibold">{title}</p>}
      <p className={title ? "mt-1.5 text-ink-soft" : ""}>{text}</p>
    </div>
  );
}

/** Closing call-to-action strip used on inner pages. */
export async function CtaBand({ title, text }: { title: string; text: string }) {
  const t = await getTranslations("common");
  const site = await getSite();
  return (
    <Section tone="teal">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl text-white">{title}</h2>
          <p className="mt-3 text-teal-100/90">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={telUrl(site.phones[0].e164)} className="btn-primary">
            <PhoneIcon /> <span dir="ltr">{site.phones[0].display}</span>
          </a>
          <a href={whatsappUrl(site.whatsapp, t("whatsappMessage"))} className="btn-whatsapp" target="_blank" rel="noopener">
            <WhatsAppIcon /> {t("whatsapp")}
          </a>
        </div>
      </div>
    </Section>
  );
}

/** Generic "prose + lists" layout shared by inner pages. */
export function TwoColumn({ main, aside }: { main: ReactNode; aside: ReactNode }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
      <div className="min-w-0">{main}</div>
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">{aside}</aside>
    </div>
  );
}

export async function ContactAside() {
  const t = await getTranslations("common");
  const site = await getSite();
  return (
    <div className="rounded-card bg-teal-950 p-6 text-white">
      <p className="eyebrow text-gold-300">{t("hoursValue")}</p>
      <p className="mt-2 text-lg font-semibold">{t("contactUs")}</p>
      <div className="mt-4 space-y-2">
        {site.phones.map((p) => (
          <a key={p.e164} href={telUrl(p.e164)} className="flex items-center gap-2 text-teal-50 hover:text-white">
            <PhoneIcon size={18} /> <span dir="ltr">{p.display}</span>
          </a>
        ))}
        <a
          href={whatsappUrl(site.whatsapp, t("whatsappMessage"))}
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 text-teal-50 hover:text-white"
        >
          <WhatsAppIcon size={18} /> {t("whatsapp")}
        </a>
      </div>
      <p className="mt-4 text-sm text-teal-100/80">{t("languagesNote")}</p>
    </div>
  );
}

/** Formats an ISO date for the current locale without shipping a date library. */
export function formatDate(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "Europe/Istanbul" }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}
