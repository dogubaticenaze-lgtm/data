import Link from "next/link";
import { requireUser } from "@/lib/admin/guard";
import { readStore, storeBackendLabel } from "@/lib/store";
import { getSite } from "@/lib/site";
import { Card, Notice, PageTitle, Shell } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const user = await requireUser();
  const { ok } = await searchParams;
  const store = await readStore({ fresh: true });
  const site = await getSite();

  const missing: string[] = [];
  if (!site.registry.mersis && !site.registry.taxNumber) missing.push("Künye: vergi/MERSİS numarası");
  if (!site.facts.foundedYear) missing.push("Kuruluş yılı");
  if (!site.sameAs.length) missing.push("Google İşletme Profili bağlantısı");
  if (!site.address.geo) missing.push("Ofis koordinatları (harita için)");

  const stats = [
    { label: "Yayındaki yorum", value: store.reviews.filter((r) => r.published && r.consent).length, href: "/admin/yorumlar" },
    { label: "Yayındaki yazı", value: store.posts.filter((p) => p.published).length, href: "/admin/yazilar" },
    { label: "Açık dosya", value: store.cases.filter((c) => c.status !== "delivered").length, href: "/admin/dosyalar" },
    { label: "Yönetici", value: store.users.length, href: "/admin/kullanicilar" },
  ];

  return (
    <Shell username={user.username} current="/admin">
      <PageTitle title="Genel bakış" text="Sitedeki bilgileri buradan güncellersiniz. Kaydettiğiniz her değişiklik anında sitede yayınlanır." />
      <Notice ok={ok} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-card border border-line bg-white p-5 shadow-card hover:border-teal-700">
            <p className="text-3xl font-semibold text-teal-950">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <Card title="Şu an sitede görünen iletişim bilgileri">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-muted">Telefon</dt><dd className="font-medium" dir="ltr">{site.phones.map((p) => p.display).join(" · ")}</dd></div>
          <div><dt className="text-muted">WhatsApp</dt><dd className="font-medium" dir="ltr">+{site.whatsapp}</dd></div>
          <div><dt className="text-muted">E-posta</dt><dd className="font-medium">{site.email}</dd></div>
          <div><dt className="text-muted">Adres</dt><dd className="font-medium">{site.address.street}, {site.address.postalCode} {site.address.district}/{site.address.city}</dd></div>
        </dl>
        <Link href="/admin/sirket" className="btn-outline mt-4 min-h-10 text-sm">Şirket bilgilerini düzenle</Link>
      </Card>

      {missing.length > 0 && (
        <Card title="Eksik bilgiler">
          <ul className="list-disc space-y-1 ps-5 text-sm text-ink-soft">
            {missing.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </Card>
      )}

      <Card title="Teknik bilgi">
        <p className="text-sm text-ink-soft">Veri deposu: <span className="font-mono">{storeBackendLabel()}</span></p>
        <p className="mt-1 text-sm text-ink-soft">Son değişiklik: {new Date(store.updatedAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</p>
      </Card>
    </Shell>
  );
}
