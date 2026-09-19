import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/admin/guard";
import { deletePostAction, savePostAction } from "@/lib/admin/actions";
import { readStore } from "@/lib/store";
import { routing } from "@/i18n/routing";
import { localeMeta } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { Card, Checkbox, Field, Notice, PageTitle, Select, Shell, SubmitButton, TextArea } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const localeOptions = routing.locales.map((l) => ({ value: l, label: localeMeta[l].label }));

export default async function EditPostPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const { ok, err } = await searchParams;
  const store = await readStore({ fresh: true });
  const post = store.posts.find((p) => p.id === id);
  if (!post) notFound();
  const publicPath = getPathname({ locale: post.locale as (typeof routing.locales)[number], href: { pathname: "/guides/[slug]", params: { slug: post.slug } } });

  return (
    <Shell username={user.username} current="/admin/yazilar">
      <PageTitle title="Yazıyı düzenle" />
      <Notice ok={ok} err={err} />
      <p className="text-sm">
        <Link href="/admin/yazilar" className="text-teal-700 underline">← Yazı listesi</Link>
        {post.published && (
          <>
            {" · "}
            <a href={publicPath} target="_blank" rel="noopener" className="text-teal-700 underline">Sitede aç ↗</a>
          </>
        )}
      </p>
      <Card>
        <form action={savePostAction} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={post.id} />
          <div className="sm:col-span-2">
            <Field label="Başlık" name="title" defaultValue={post.title} required />
          </div>
          <Select label="Dil" name="locale" defaultValue={post.locale} options={localeOptions} />
          <Field label="Tarih" name="date" type="date" defaultValue={post.date} />
          <div className="sm:col-span-2">
            <Field label="Adres (slug)" name="slug" defaultValue={post.slug} dir="ltr" hint="Değiştirirseniz eski bağlantı çalışmaz." />
          </div>
          <div className="sm:col-span-2">
            <TextArea label="Kısa özet" name="excerpt" defaultValue={post.excerpt} rows={2} dir="auto" />
          </div>
          <div className="sm:col-span-2">
            <TextArea label="Yazı içeriği" name="body" defaultValue={post.body} rows={18} dir="auto" mono hint="'## Başlık', '- madde', '1. madde', **kalın**, [metin](https://adres). Boş satır yeni paragraf." />
          </div>
          <Checkbox label="Yayında" name="published" defaultChecked={post.published} />
          <div className="sm:col-span-2">
            <SubmitButton>Güncelle</SubmitButton>
          </div>
        </form>
      </Card>
      <Card title="Yazıyı sil">
        <form action={deletePostAction}>
          <input type="hidden" name="id" value={post.id} />
          <SubmitButton variant="danger">Bu yazıyı kalıcı olarak sil</SubmitButton>
        </form>
      </Card>
    </Shell>
  );
}
