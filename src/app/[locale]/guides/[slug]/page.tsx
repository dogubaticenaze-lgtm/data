import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { localeOf, resolveLocale, type SlugParams } from "@/lib/params";
import { absoluteUrl, articleJsonLd, pageMetadata } from "@/lib/seo";
import { readStore } from "@/lib/store";
import { renderMarkdown } from "@/lib/markdown";
import { JsonLd } from "@/components/JsonLd";
import { ContactAside, CtaBand, PageHeader, Section, TwoColumn, formatDate } from "@/components/ui";
import { ArrowIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

async function findPost(locale: AppLocale, slug: string) {
  const store = await readStore();
  return store.posts.find((p) => p.published && p.locale === locale && p.slug === slug) ?? null;
}

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const locale = await localeOf(params);
  const { slug } = await params;
  const post = await findPost(locale, slug);
  if (!post) return {};
  return pageMetadata({ locale, pathname: "/guides/[slug]", slugs: { [locale]: slug }, title: post.title, description: post.excerpt });
}

export default async function Page({ params }: SlugParams) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const post = await findPost(locale, slug);
  if (!post) notFound();

  const messages = await getMessages();
  const p = messages.pages.guides;
  const tc = await getTranslations("common");
  const self = absoluteUrl(locale, { pathname: "/guides/[slug]", params: { slug } });

  return (
    <>
      <PageHeader
        title={post.title}
        intro={post.excerpt}
        eyebrow={`${tc("publishedOn")}: ${formatDate(post.date, locale)}`}
        crumbs={[{ name: p.title, href: "/guides" }, { name: post.title }]}
        crumbUrls={[absoluteUrl(locale, "/guides"), self]}
      />
      <Section>
        <TwoColumn
          main={
            <article>
              <div
                className="prose-site space-y-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:text-teal-950 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:text-teal-950 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:list-decimal [&_ol]:ps-6 [&_li]:mt-1 [&_a]:text-teal-700 [&_a]:underline [&_blockquote]:border-s-4 [&_blockquote]:border-gold-400 [&_blockquote]:ps-4 [&_hr]:my-8 [&_hr]:border-line"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
              />
              {post.updatedAt && post.updatedAt.slice(0, 10) !== post.date.slice(0, 10) && (
                <p className="mt-8 text-sm text-muted">
                  {tc("updatedOn")}: {formatDate(post.updatedAt, locale)}
                </p>
              )}
              <Link href="/guides" className="btn-outline mt-8">
                <ArrowIcon size={16} className="-scale-x-100 rtl:scale-x-100" /> {tc("backToList")}
              </Link>
            </article>
          }
          aside={<ContactAside />}
        />
      </Section>
      <CtaBand title={messages.home.contactTitle} text={messages.home.contactText} />
      <JsonLd data={articleJsonLd({ url: self, title: post.title, description: post.excerpt, date: post.date, updated: post.updatedAt || post.date, locale })} />
    </>
  );
}
