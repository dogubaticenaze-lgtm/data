import { requireUser } from "@/lib/admin/guard";
import { saveSettingsAction } from "@/lib/admin/actions";
import { getSite } from "@/lib/site";
import { Card, Field, Notice, PageTitle, Shell, SubmitButton, TextArea } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const user = await requireUser();
  const { ok, err } = await searchParams;
  const site = await getSite();
  const p = (i: number) => site.phones[i];

  return (
    <Shell username={user.username} current="/admin/sirket">
      <PageTitle title="Şirket bilgileri" text="Telefon, WhatsApp, e-posta, adres ve künye. Kaydedince sitenin tüm sayfalarında ve tüm dillerde güncellenir." />
      <Notice ok={ok} err={err} />
      <form action={saveSettingsAction} className="space-y-6">
        <Card title="Telefonlar">
          <p className="mb-4 text-sm text-ink-soft">
            &quot;Görünen&quot; alanına numarayı istediğiniz gibi yazın (örn. +90 534 450 48 62). &quot;Arama biçimi&quot; alanı telefon uygulamasının çevireceği numaradır: + ile başlar, boşluksuz (örn. +905344504862). İlk numara ana numaradır.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="contents">
                <Field label={`${i + 1}. telefon (görünen)`} name={`phone${i + 1}_display`} defaultValue={p(i)?.display} dir="ltr" required={i === 0} />
                <Field label={`${i + 1}. telefon (arama biçimi)`} name={`phone${i + 1}_e164`} defaultValue={p(i)?.e164} dir="ltr" placeholder="+90..." required={i === 0} />
              </div>
            ))}
          </div>
        </Card>

        <Card title="WhatsApp ve e-posta">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="WhatsApp numarası" name="whatsapp" defaultValue={site.whatsapp} dir="ltr" hint="Ülke koduyla, sadece rakam: 905344504862" required />
            <Field label="E-posta" name="email" type="email" defaultValue={site.email} dir="ltr" required />
          </div>
        </Card>

        <Card title="Adres">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Sokak / cadde / kapı no" name="street" defaultValue={site.address.street} required />
            </div>
            <Field label="İlçe" name="district" defaultValue={site.address.district} required />
            <Field label="İl" name="city" defaultValue={site.address.city} required />
            <Field label="Posta kodu" name="postalCode" defaultValue={site.address.postalCode} dir="ltr" />
            <div className="sm:col-span-2">
              <Field label="Google Haritalar bağlantısı" name="mapsUrl" defaultValue={site.address.mapsUrl} dir="ltr" hint="Google Haritalar'da ofisi bulup Paylaş > Bağlantıyı kopyala." />
            </div>
            <Field label="Enlem (latitude)" name="lat" defaultValue={site.address.geo?.lat ?? ""} dir="ltr" placeholder="41.06" hint="İsteğe bağlı; Google Haritalar'da sağ tıklayınca görünür." />
            <Field label="Boylam (longitude)" name="lng" defaultValue={site.address.geo?.lng ?? ""} dir="ltr" placeholder="28.91" />
          </div>
        </Card>

        <Card title="Kanıtlanabilir sayılar">
          <p className="mb-4 text-sm text-ink-soft">Boş bırakılan sayı sitede gösterilmez. Yalnızca belgeleyebileceğiniz değerleri yazın.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Kuruluş yılı" name="foundedYear" defaultValue={site.facts.foundedYear} dir="ltr" placeholder="2015" />
            <Field label="Tamamlanan nakil sayısı" name="completedTransfers" defaultValue={site.facts.completedTransfers} dir="ltr" placeholder="500" />
            <Field label="Hizmet verilen ülke sayısı" name="countriesServed" defaultValue={site.facts.countriesServed} dir="ltr" placeholder="30" />
          </div>
        </Card>

        <Card title="Künye (yasal zorunluluk)">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Resmi unvan" name="legalName" defaultValue={site.legalName} required />
            </div>
            <Field label="Vergi dairesi" name="taxOffice" defaultValue={site.registry.taxOffice} />
            <Field label="Vergi numarası" name="taxNumber" defaultValue={site.registry.taxNumber} dir="ltr" />
            <Field label="MERSİS numarası" name="mersis" defaultValue={site.registry.mersis} dir="ltr" />
            <Field label="Ticaret sicil numarası" name="tradeRegistry" defaultValue={site.registry.tradeRegistry} dir="ltr" />
            <Field label="KEP adresi" name="kep" defaultValue={site.registry.kep} dir="ltr" />
            <Field label="Barındırma (hosting) firması" name="hosting" defaultValue={site.registry.hosting} />
          </div>
        </Card>

        <Card title="Google İşletme Profili ve sosyal medya">
          <TextArea label="Bağlantılar (her satıra bir tane)" name="sameAs" defaultValue={site.sameAs.join("\n")} rows={3} dir="ltr" hint="https:// ile başlamalı. Alt bilgide gösterilir ve arama motorlarına bildirilir." />
        </Card>

        <SubmitButton>Kaydet</SubmitButton>
      </form>
    </Shell>
  );
}
