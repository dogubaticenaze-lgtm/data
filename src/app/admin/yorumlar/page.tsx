import Link from "next/link";
import { requireUser } from "@/lib/admin/guard";
import { deleteReviewAction, saveReviewAction } from "@/lib/admin/actions";
import { readStore } from "@/lib/store";
import { routing } from "@/i18n/routing";
import { localeMeta } from "@/config/site";
import { Card, Checkbox, Field, Notice, PageTitle, Select, Shell, SubmitButton, TextArea } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const localeOptions = routing.locales.map((l) => ({ value: l, label: localeMeta[l].label }));

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string; duzenle?: string }> }) {
  const user = await requireUser();
  const { ok, err, duzenle } = await searchParams;
  const store = await readStore({ fresh: true });
  const editing = store.reviews.find((r) => r.id === duzenle);
  const reviews = store.reviews.slice().sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Shell username={user.username} current="/admin/yorumlar">
      <PageTitle title="Yorumlar" text="Yalnızca izin alınmış gerçek yorumları ekleyin. 'İzin alındı' ve 'Yayında' işaretli olanlar anasayfada görünür." />
      <Notice ok={ok} err={err} />

      <Card title={editing ? "Yorumu düzenle" : "Yeni yorum ekle"}>
        <form action={saveReviewAction} className="grid gap-4 sm:grid-cols-2">
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <Field label="Ad (kısaltılmış)" name="name" defaultValue={editing?.name} placeholder="A. K." required hint="Tam ad yazmayın; KVKK gereği kısaltma yeterli." />
          <Field label="Ülke / şehir" name="country" defaultValue={editing?.country} placeholder="Almanya" />
          <Select label="Yorumun dili" name="locale" defaultValue={editing?.locale ?? "tr"} options={localeOptions} />
          <Field label="Kaynak" name="source" defaultValue={editing?.source} placeholder="Google" />
          <Field label="Tarih" name="date" type="date" defaultValue={editing?.date ?? new Date().toISOString().slice(0, 10)} />
          <div className="sm:col-span-2">
            <TextArea label="Yorum metni" name="text" defaultValue={editing?.text} rows={4} dir="auto" />
          </div>
          <Checkbox label="Yorum sahibinden yayın izni alındı" name="consent" defaultChecked={editing?.consent} hint="İzin olmadan yayınlanmaz." />
          <Checkbox label="Yayında" name="published" defaultChecked={editing?.published ?? true} />
          <div className="flex gap-3 sm:col-span-2">
            <SubmitButton>{editing ? "Güncelle" : "Ekle"}</SubmitButton>
            {editing && <Link href="/admin/yorumlar" className="btn-outline min-h-10 px-4 py-2 text-sm">Vazgeç</Link>}
          </div>
        </form>
      </Card>

      <Card title={`Kayıtlı yorumlar (${reviews.length})`}>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted">Henüz yorum yok.</p>
        ) : (
          <ul className="divide-y divide-line">
            {reviews.map((r) => (
              <li key={r.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-ink-soft" dir="auto">&ldquo;{r.text}&rdquo;</p>
                  <p className="mt-1 text-xs text-muted">
                    {r.name}{r.country ? `, ${r.country}` : ""} · {r.date} · {localeMeta[r.locale as keyof typeof localeMeta]?.label ?? r.locale}
                    {r.source ? ` · ${r.source}` : ""} · {r.consent ? "izin var" : "izin YOK"} · {r.published ? "yayında" : "taslak"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link href={`/admin/yorumlar?duzenle=${r.id}`} className="btn-outline min-h-9 px-3 py-1 text-xs">Düzenle</Link>
                  <form action={deleteReviewAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <SubmitButton variant="danger">Sil</SubmitButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Shell>
  );
}
