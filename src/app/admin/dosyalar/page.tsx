import Link from "next/link";
import { requireUser } from "@/lib/admin/guard";
import { saveCaseAction } from "@/lib/admin/actions";
import { readStore } from "@/lib/store";
import { statusLabels, statusOptions } from "@/lib/admin/labels";
import { Card, Field, Notice, PageTitle, Select, Shell, SubmitButton, TextArea } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function CasesPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const user = await requireUser();
  const { ok, err } = await searchParams;
  const store = await readStore({ fresh: true });
  const cases = store.cases.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <Shell username={user.username} current="/admin/dosyalar">
      <PageTitle title="Dosya takip" text="Aileye veya iş ortağına verdiğiniz takip koduyla sitedeki 'Dosya Takip' sayfasından aşamayı görebilirler. Kişisel veri girmeyin; yalnızca güzergâh ve aşama." />
      <Notice ok={ok} err={err} />

      <Card title="Yeni dosya">
        <form action={saveCaseAction} className="grid gap-4 sm:grid-cols-2">
          <Field label="İç etiket (sadece siz görürsünüz)" name="label" placeholder="Berlin dosyası - 12 Eylül" />
          <Field label="Takip kodu" name="code" dir="ltr" placeholder="boş bırakılırsa otomatik üretilir (DB-2026-1234)" />
          <Field label="Güzergâh (sitede görünür)" name="route" placeholder="İstanbul → Berlin" required />
          <Select label="Durum" name="status" defaultValue="received" options={statusOptions} />
          <div className="sm:col-span-2">
            <TextArea label="Aileye not (sitede görünür, isteğe bağlı)" name="note" rows={2} />
          </div>
          <div className="sm:col-span-2">
            <SubmitButton>Dosya oluştur</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title={`Dosyalar (${cases.length})`}>
        {cases.length === 0 ? (
          <p className="text-sm text-muted">Henüz dosya yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted">
                <tr><th className="py-2 pe-3">Kod</th><th className="py-2 pe-3">Etiket</th><th className="py-2 pe-3">Güzergâh</th><th className="py-2 pe-3">Durum</th><th className="py-2 pe-3">Güncelleme</th><th></th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {cases.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2 pe-3 font-mono" dir="ltr">{c.code}</td>
                    <td className="py-2 pe-3">{c.label}</td>
                    <td className="py-2 pe-3">{c.route}</td>
                    <td className="py-2 pe-3">{statusLabels[c.status]}</td>
                    <td className="py-2 pe-3 text-muted">{new Date(c.updatedAt).toLocaleDateString("tr-TR")}</td>
                    <td className="py-2"><Link href={`/admin/dosyalar/${c.id}`} className="btn-outline min-h-9 px-3 py-1 text-xs">Güncelle</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </Shell>
  );
}
