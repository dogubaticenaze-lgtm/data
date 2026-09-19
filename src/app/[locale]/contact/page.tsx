import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSite, telUrl, whatsappUrl } from "@/lib/site";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader, Section } from "@/components/ui";
import { ArrowIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  return pageMetadata({ locale, pathname: "/contact", title: t("title"), description: t("description") });
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const p = messages.pages.contact;
  const tc = await getTranslations("common");
  const site = await getSite();
  const a = site.address;

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} crumbs={[{ name: p.title }]} crumbUrls={[absoluteUrl(locale, "/contact")]} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <div className="card space-y-4">
              {site.phones.map((ph) => (
                <a key={ph.e164} href={telUrl(ph.e164)} className="flex items-center gap-3 text-lg font-semibold text-teal-950 hover:text-teal-700">
                  <PhoneIcon className="text-gold-700" /> <span dir="ltr">{ph.display}</span>
                </a>
              ))}
              <a href={whatsappUrl(site.whatsapp, tc("whatsappMessage"))} target="_blank" rel="noopener" className="flex items-center gap-3 text-lg font-semibold text-teal-950 hover:text-teal-700">
                <WhatsAppIcon className="text-whatsapp" /> {tc("whatsapp")}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-teal-950 hover:text-teal-700">
                <MailIcon className="text-gold-700" /> {site.email}
              </a>
              <p className="flex items-center gap-3 text-ink-soft">
                <ClockIcon className="text-gold-700" /> {tc("hours")}: {tc("hoursValue")}
              </p>
              <p className="text-sm text-muted">{tc("languagesNote")}</p>
            </div>

            <div className="card">
              <h2 className="flex items-center gap-2 text-lg text-teal-950">
                <MapPinIcon className="text-gold-700" /> {p.mapTitle}
              </h2>
              <address className="mt-2 not-italic text-ink-soft">
                {a.street}
                <br />
                {a.postalCode} {a.district} / {a.city}
              </address>
              <a href={a.mapsUrl} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-2 font-semibold text-teal-700">
                {tc("openInMaps")} <ArrowIcon size={16} />
              </a>
            </div>

            <div className="rounded-card bg-teal-950 p-6 text-white">
              <h2 className="text-lg">{p.corporateTitle}</h2>
              <p className="mt-2 text-sm text-teal-100/90">{messages.pages.partners.formNote}</p>
              <Link href="/partners" className="mt-4 inline-flex items-center gap-2 font-semibold text-gold-300">
                {messages.pages.partners.cta} <ArrowIcon size={16} />
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl text-teal-950">{p.formTitle}</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
