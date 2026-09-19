import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { servicePaths, type ServiceKey } from "@/components/ServicePage";
import { CtaBand, InfoBlock, PageHeader, Section } from "@/components/ui";
import { ArrowIcon, DocumentIcon, PlaneDownIcon, PlaneIcon, ShieldIcon, TransitIcon, TruckIcon } from "@/components/icons";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "pages.services" });
  return pageMetadata({ locale, pathname: "/services", title: t("title"), description: t("description") });
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("pages.services");
  const nav = await getTranslations("nav");
  const messages = await getMessages();

  const icons = { outbound: PlaneIcon, inbound: PlaneDownIcon, transit: TransitIcon, domestic: TruckIcon } as const;
  const main = (Object.keys(servicePaths) as ServiceKey[]).map((k) => ({
    href: servicePaths[k],
    title: messages.pages[k].title,
    text: messages.pages[k].description,
    Icon: icons[k],
  }));
  const support = [
    { href: "/documents", title: messages.pages.documents.title, text: messages.pages.documents.description, Icon: DocumentIcon },
    { href: "/coffins", title: messages.pages.coffins.title, text: messages.pages.coffins.description, Icon: ShieldIcon },
  ] as const;

  return (
    <>
      <PageHeader
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ name: t("title") }]}
        crumbUrls={[absoluteUrl(locale, "/services")]}
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {main.map(({ href, title, text, Icon }) => (
            <Link key={href} href={href} className="card group flex gap-5 transition-shadow hover:shadow-lg">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-950 text-gold-300">
                <Icon size={24} />
              </span>
              <span>
                <h2 className="text-xl text-teal-950">{title}</h2>
                <p className="mt-2 text-ink-soft">{text}</p>
                <span className="mt-3 inline-flex items-center gap-2 font-semibold text-teal-700 group-hover:text-teal-900">
                  {nav("services")} <ArrowIcon size={18} />
                </span>
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {support.map(({ href, title, text, Icon }) => (
            <Link key={href} href={href} className="card flex gap-5 transition-shadow hover:shadow-lg">
              <Icon className="shrink-0 text-teal-700" size={28} />
              <span>
                <h2 className="text-xl text-teal-950">{title}</h2>
                <p className="mt-2 text-ink-soft">{text}</p>
              </span>
            </Link>
          ))}
        </div>
      </Section>
      <Section tone="paper">
        <div className="max-w-3xl">
          <InfoBlock title={t("otherTitle")} items={t.raw("other") as string[]} />
        </div>
      </Section>
      <CtaBand title={messages.home.contactTitle} text={messages.home.contactText} />
    </>
  );
}
