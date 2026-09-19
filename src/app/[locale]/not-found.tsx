import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <Section tone="paper" className="min-h-[50vh]">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-3xl sm:text-4xl text-teal-950">{t("title")}</h1>
      <p className="mt-4 max-w-xl text-ink-soft">{t("text")}</p>
      <Link href="/" className="btn-secondary mt-8">
        {t("cta")}
      </Link>
    </Section>
  );
}
