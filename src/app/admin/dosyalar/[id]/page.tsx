import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/admin/guard";
import { deleteCaseAction, saveCaseAction } from "@/lib/admin/actions";
import { readStore } from "@/lib/store";
import { statusLabels, statusOptions } from "@/lib/admin/labels";
import { Card, Field, Notice, PageTitle, Select, Shell, SubmitButton, TextArea } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function EditCasePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; err?: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const { ok, err } = await searchParams;
  const store = await readStore({ fresh: true });
  const c = store.cases.find((x) => x.id === id);
  if (!c) notFound();

  return (
    <Shell username={user.username} current="/admin/dosyalar">
      <PageTitle title={`Dosya ${c.code}`} text="Durumu değiştirip kaydettiğinizde geçmişe otomatik olarak yeni bir satır eklenir." />
      <Notice ok={ok} err={err} />
      <p className="text-sm">
        <Link href="/admin/dosyalar" className="text-teal-700 underline">← Dosya listesi</Link>
        {" · "}
        <a href={`/dosya-takip?code=${encodeURIComponent(c.code)}`} target="_blank" rel="noopener" className="text-teal-700 underline">Aile ne görüyor? ↗</a>
      </p>
      <Card>
        <form action={saveCaseAction} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={c.id} />
          <Field label="Takip kodu" name="code_readonly" defaultValue={c.code} dir="ltr" hint="Kod değiştirilemez; aileye bu kodu verin." />
          <Field label="İç etiket" name="label" defaultValue={c.label} />
          <Field label="Güzergâh" name="route" defaultValue={c.route} required />
          <Select label="Durum" name="status" defaultValue={c.status} options={statusOptions} />
          <div className="sm:col-span-2">
            <TextArea label="Aileye not (sitede görünür)" name="note" defaultValue={c.note} rows={2} />
          </div>
          <div className="sm:col-span-2">
            <SubmitButton>Kaydet</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title="Geçmiş">
        <ul className="divide-y divide-line text-sm">
          {c.updates.slice().reverse().map((u, i) => (
            <li key={i} className="flex flex-col gap-1 py-2 sm:flex-row sm:gap-4">
              <span className="shrink-0 text-muted">{new Date(u.at).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</span>
              <span><span className="font-medium text-teal-950">{statusLabels[u.status]}</span>{u.note ? ` - ${u.note}` : ""}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Dosyayı sil">
        <p className="mb-3 text-sm text-ink-soft">Teslim edilen dosyaları bir süre sonra silmeniz önerilir; sitede kod ile sorgulanamaz hâle gelir.</p>
        <form action={deleteCaseAction}>
          <input type="hidden" name="id" value={c.id} />
          <SubmitButton variant="danger">Dosyayı sil</SubmitButton>
        </form>
      </Card>
    </Shell>
  );
}
