import { requireUser } from "@/lib/admin/guard";
import { saveFlagsAction } from "@/lib/admin/actions";
import { readStore, storeBackendLabel } from "@/lib/store";
import { Card, Checkbox, Notice, PageTitle, Shell, SubmitButton } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function FlagsPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const user = await requireUser();
  const { ok, err } = await searchParams;
  const store = await readStore({ fresh: true });

  return (
    <Shell username={user.username} current="/admin/ayarlar">
      <PageTitle title="Ayarlar" text="Sitedeki bazı bölümleri açıp kapatın." />
      <Notice ok={ok} err={err} />
      <Card>
        <form action={saveFlagsAction} className="space-y-4">
          <Checkbox
            label="Maliyet rehberinde tahmini fiyat aralıklarını göster"
            name="showPriceRanges"
            defaultChecked={store.flags.showPriceRanges}
            hint="Fiyat aralığı yayınlamak reklam ve mesafeli sözleşme mevzuatına tabidir; avukat onayı alınmadan açmayın. Kapalıyken yalnızca 'fiyatı belirleyen kalemler' görünür."
          />
          <Checkbox label="Anasayfada yorumlar bölümünü göster" name="showReviews" defaultChecked={store.flags.showReviews} hint="Yalnızca izinli ve yayında işaretli yorumlar görünür." />
          <Checkbox label="Dosya takip sayfasını etkinleştir" name="showCaseTracking" defaultChecked={store.flags.showCaseTracking} hint="Kapalıyken sayfa açılır ama sorgulama yapılamaz." />
          <SubmitButton>Kaydet</SubmitButton>
        </form>
      </Card>
      <Card title="Yedekleme">
        <p className="text-sm text-ink-soft">
          Paneldeki tüm veriler tek bir dosyada tutulur: <span className="font-mono">{storeBackendLabel()}</span>. Yerel dosya kullanılıyorsa bu dosyayı düzenli olarak yedekleyin (kullanım kılavuzu, &quot;Yedekleme&quot; bölümü).
        </p>
      </Card>
    </Shell>
  );
}
