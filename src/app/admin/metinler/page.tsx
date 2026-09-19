import Link from "next/link";
import { requireUser } from "@/lib/admin/guard";
import { resetContentAction, saveContentAction } from "@/lib/admin/actions";
import { readStore } from "@/lib/store";
import { baseMessages } from "@/lib/messages";
import { editableSections, flatten } from "@/lib/content";
import { routing, type AppLocale } from "@/i18n/routing";
import { localeMeta } from "@/config/site";
import { Card, Notice, PageTitle, Shell, SubmitButton } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

type Q = { dil?: string; bolum?: string; ok?: string; err?: string; ara?: string };

export default async function ContentPage({ searchParams }: { searchParams: Promise<Q> }) {
  const user = await requireUser();
  const q = await searchParams;
  const locale = (routing.locales.includes(q.dil as AppLocale) ? q.dil : "tr") as AppLocale;
  const section = editableSections.some((s) => s.key === q.bolum) ? q.bolum! : "home";
  const search = (q.ara ?? "").trim().toLowerCase();
  const store = await readStore({ fresh: true });
  const overrides = store.content[locale] ?? {};
  const base = flatten(baseMessages[locale] as never);
  const entries = Object.entries(base).filter(([k]) => k === section || k.startsWith(section + "."));
  const filtered = search ? entries.filter(([k, v]) => k.toLowerCase().includes(search) || v.toLowerCase().includes(search) || (overrides[k] ?? "").toLowerCase().includes(search)) : entries;
  const changedInSection = entries.filter(([k]) => k in overrides).length;
  const dir = localeMeta[locale].dir;

  return (
    <Shell username={user.username} current="/admin/metinler">
      <PageTitle title="Site metinleri" text="Sitedeki her cümleyi dil dil düzenleyin. Bir kutuyu boş bırakırsanız veya orijinal metne döndürürseniz varsayılan metin kullanılır." />
      <Notice ok={q.ok} err={q.err} />

      <Card>
        <div className="flex flex-wrap gap-2">
          {routing.locales.map((l) => (
            <Link key={l} href={`/admin/metinler?dil=${l}&bolum=${encodeURIComponent(section)}`} className={`rounded-full px-3 py-1.5 text-sm ${l === locale ? "bg-teal-950 text-white" : "border border-line hover:bg-paper"}`}>
              {localeMeta[l].label}
            </Link>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {editableSections.map((s) => (
            <Link key={s.key} href={`/admin/metinler?dil=${locale}&bolum=${encodeURIComponent(s.key)}`} className={`rounded-lg px-2.5 py-1 text-xs ${s.key === section ? "bg-teal-100 font-semibold text-teal-950" : "text-ink-soft hover:bg-paper"}`}>
              {s.label}
            </Link>
          ))}
        </div>
        <form method="get" className="mt-4 flex gap-2">
          <input type="hidden" name="dil" value={locale} />
          <input type="hidden" name="bolum" value={section} />
          <input name="ara" defaultValue={q.ara ?? ""} placeholder="Bu bölümde ara..." className="w-full max-w-sm rounded-lg border border-line px-3 py-2 text-sm" />
          <button type="submit" className="btn-outline min-h-10 px-4 py-2 text-sm">Ara</button>
        </form>
      </Card>

      <form action={saveContentAction} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="section" value={section} />
        <Card title={`${editableSections.find((s) => s.key === section)?.label} · ${localeMeta[locale].label} (${filtered.length} metin${changedInSection ? `, ${changedInSection} değiştirilmiş` : ""})`}>
          <div className="space-y-4">
            {filtered.map(([key, original]) => {
              const current = overrides[key] ?? original;
              const changed = key in overrides;
              const long = original.length > 90;
              return (
                <div key={key} className={`rounded-lg border p-3 ${changed ? "border-gold-500/60 bg-gold-100/40" : "border-line"}`}>
                  <label className="block">
                    <span className="flex items-center justify-between gap-2 text-xs text-muted">
                      <span className="font-mono">{key}</span>
                      {changed && <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-semibold text-teal-950">değiştirildi</span>}
                    </span>
                    {long ? (
                      <textarea name={`c:${key}`} defaultValue={current} rows={Math.min(8, Math.ceil(current.length / 90) + 1)} dir={dir} className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-teal-700" />
                    ) : (
                      <input name={`c:${key}`} defaultValue={current} dir={dir} className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-teal-700" />
                    )}
                  </label>
                  {changed && <p className="mt-1 text-xs text-muted">Orijinal: {original}</p>}
                </div>
              );
            })}
            {filtered.length === 0 && <p className="text-sm text-muted">Bu aramayla eşleşen metin yok.</p>}
          </div>
        </Card>
        <div className="flex flex-wrap gap-3">
          <SubmitButton>Kaydet</SubmitButton>
        </div>
      </form>
      {changedInSection > 0 && (
        <form action={resetContentAction}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="section" value={section} />
          <SubmitButton variant="outline">Bu bölümü orijinal metinlere döndür</SubmitButton>
        </form>
      )}
    </Shell>
  );
}
