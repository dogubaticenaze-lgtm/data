import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeOf, resolveLocale, type LocaleParams } from "@/lib/params";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { readStore } from "@/lib/store";
import { ContactAside, CtaBand, PageHeader, Section, TwoColumn, formatDate } from "@/components/ui";
import { ArrowIcon } from "@/components/icons";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const t = await getTranslations({ locale, namespace: "pages.guides" });
  return pageMetadata({ locale, pathname: "/guides", title: t("title"), description: t("description") });
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();
  const p = messages.pages.guides;
  const tc = await getTranslations("common");
  const store = await readStore();
  const posts = store.posts
    .filter((x) => x.published && x.locale === locale)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} crumbs={[{ name: p.title }]} crumbUrls={[absoluteUrl(locale, "/guides")]} />
      <Section>
        <TwoColumn
          main={
            posts.length === 0 ? (
              <p className="rounded-card border border-line bg-paper p-6 text-ink-soft">{p.empty}</p>
            ) : (
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post.id} className="card">
                    <p className="text-sm text-muted">{formatDate(post.date, locale)}</p>
                    <h2 className="mt-1 text-xl text-teal-950">
                      <Link href={{ pathname: "/guides/[slug]", params: { slug: post.slug } }} className="hover:text-teal-700">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-ink-soft">{post.excerpt}</p>
                    <Link
                      href={{ pathname: "/guides/[slug]", params: { slug: post.slug } }}
                      className="mt-3 inline-flex items-center gap-2 font-semibold text-teal-700"
                    >
                      {tc("readMore")} <ArrowIcon size={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            )
          }
          aside={<ContactAside />}
        />
      </Section>
      <CtaBand title={messages.home.contactTitle} text={messages.home.contactText} />
    </>
  );
}
