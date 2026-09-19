import Link from "next/link";
import { requireUser } from "@/lib/admin/guard";
import { savePostAction } from "@/lib/admin/actions";
import { readStore } from "@/lib/store";
import { routing } from "@/i18n/routing";
import { localeMeta } from "@/config/site";
import { Card, Checkbox, Field, Notice, PageTitle, Select, Shell, SubmitButton, TextArea } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const localeOptions = routing.locales.map((l) => ({ value: l, label: localeMeta[l].label }));

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const user = await requireUser();
  const { ok, err } = await searchParams;
  const store = await readStore({ fresh: true });
  const posts = store.posts.slice().sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Shell username={user.username} current="/admin/yazilar">
      <PageTitle title="Rehber yazıları" text="Sitedeki 'Rehber' bölümünde yayınlanan yazılar. Her yazı tek bir dilde yazılır; aynı yazıyı başka dilde vermek için o dilde yeni yazı ekleyin." />
      <Notice ok={ok} err={err} />

      <Card title="Yeni yazı">
        <form action={savePostAction} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Başlık" name="title" required placeholder="Antalya'da vefat eden bir yakın için ne yapılır?" />
          </div>
          <Select label="Dil" name="locale" defaultValue="tr" options={localeOptions} />
          <Field label="Tarih" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
          <div className="sm:col-span-2">
            <Field label="Adres (slug)" name="slug" dir="ltr" placeholder="boş bırakılırsa başlıktan üretilir" hint="Sadece küçük harf, rakam ve tire. Örn: antalyada-vefat" />
          </div>
          <div className="sm:col-span-2">
            <TextArea label="Kısa özet (listede ve arama motorunda görünür)" name="excerpt" rows={2} dir="auto" />
          </div>
          <div className="sm:col-span-2">
            <TextArea
              label="Yazı içeriği"
              name="body"
              rows={14}
              dir="auto"
              mono
              hint="Basit biçimlendirme: '## Başlık' alt başlık, '- madde' liste, '1. madde' numaralı liste, **kalın**, [bağlantı metni](https://adres). Boş satır yeni paragraf."
            />
          </div>
          <Checkbox label="Yayında" name="published" defaultChecked hint="İşareti kaldırırsanız taslak olarak kalır." />
          <div className="sm:col-span-2">
            <SubmitButton>Kaydet</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title={`Yazılar (${posts.length})`}>
        {posts.length === 0 ? (
          <p className="text-sm text-muted">Henüz yazı yok.</p>
        ) : (
          <ul className="divide-y divide-line">
            {posts.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <Link href={`/admin/yazilar/${p.id}`} className="font-medium text-teal-950 hover:underline">{p.title}</Link>
                  <p className="text-xs text-muted">{localeMeta[p.locale as keyof typeof localeMeta]?.label ?? p.locale} · {p.date} · /{p.slug} · {p.published ? "yayında" : "taslak"}</p>
                </div>
                <Link href={`/admin/yazilar/${p.id}`} className="btn-outline min-h-9 shrink-0 px-3 py-1 text-xs">Düzenle</Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Shell>
  );
}
