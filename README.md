# dogubaticenaze.com — yeni site

Doğu Batı Uluslararası Cenaze Hizmetleri için Next.js 16 + next-intl 4 + Tailwind 4 ile hazırlanmış, altı dilli (TR kök, EN, RU, DE; AR ve FA sağdan sola) kurumsal site ve yerleşik yönetim paneli. Teknik olmayan kullanım kılavuzu: `docs/Kullanim_Kilavuzu.pdf`. Plan: `docs/plan-v2.pdf`.

## Hızlı başlangıç

Windows'ta: `1-Kurulum.bat` (bir kez), sonra `2-Baslat.bat`. Panel: http://localhost:3000/admin (ilk açılışta yönetici hesabı oluşturulur).

Komut satırında:

```bash
npm install
cp .env.example .env.local     # isteğe bağlı: e-posta, Turnstile, Plausible, Vercel Blob
npm run dev                    # http://localhost:3000
npm run build && npm start     # üretim
```

Gereksinim: Node.js 20.9+ (geliştirmede Node 24).

## Yapı

| Yol | Ne var |
| --- | --- |
| `messages/{tr,en,ru,ar,fa,de}.json` | Sitedeki bütün varsayılan metinler (yapı altı dosyada eşit). |
| `src/config/site.ts` | Varsayılan telefon/adres/künye; panelden değiştirilen değerler bunların üstüne yazılır. |
| `src/lib/store.ts` | Panel verisinin tek JSON deposu: `BLOB_READ_WRITE_TOKEN` varsa Vercel Blob, yoksa `data/store.json`. |
| `src/lib/site.ts` | `getSite()`: varsayılanlar + panel ayarları. Bileşenler telefon/adres bilgisini buradan alır. |
| `src/lib/auth.ts`, `src/lib/admin/*` | Yönetici hesapları (scrypt), HMAC imzalı oturum çerezi, giriş kilidi, tüm panel aksiyonları. |
| `src/app/admin/*` | Panel: kurulum, giriş, genel bakış, şirket bilgileri, metinler (dil bazlı), yorumlar, rehber yazıları, dosya takip, kullanıcılar, ayarlar. |
| `src/i18n/routing.ts` | Diller ve çevrilmiş URL'ler. Otomatik dil yönlendirmesi kapalı. |
| `src/proxy.ts` | Next 16 istek yakalayıcı; `/admin`, `/downloads` ve dosyalar dil yönlendirmesinin dışında. |
| `src/app/[locale]/…` | Herkese açık sayfalar (klasör adı iç anahtar). |
| `src/app/sitemap.ts`, `robots.ts` | hreflang'li site haritası (yayındaki rehber yazıları dahil) ve robots. |
| `src/lib/seo.ts` | Metadata, canonical/hreflang, JSON-LD (LocalBusiness, Service, BreadcrumbList, FAQPage, Article, Review). |
| `src/lib/actions/contact.ts` | Form: doğrulama, bal küpü, hız sınırı, Turnstile ve Resend (isteğe bağlı). |
| `public/downloads/*.pdf` | İndirilebilir belgeler (kaynak HTML: `docs/downloads/`). |
| `next.config.ts` | 301 yönlendirmeler, güvenlik başlıkları. |

## Yönetim paneli

- `/admin/kurulum` yalnızca hiç yönetici yokken açılır; ilk hesabı oluşturur.
- Şifreler scrypt ile hashlenir; oturum 14 gün, HMAC imzalı, `httpOnly` çerez. 6 hatalı giriş → 15 dakika kilit.
- Metin düzenleyici, mesaj dosyalarının üstüne dil bazlı geçersiz kılma yazar (`store.content[locale][path]`); orijinale döndürülebilir.
- Her kayıt `revalidatePath("/", "layout")` ile statik sayfaları yeniler.
- Bayraklar: fiyat aralıkları (varsayılan kapalı, avukat onayı gerekir), yorumlar, dosya takip.

### Şifre sıfırlama (tek yönetici ve şifre unutulduysa)

Yerel dosyada: `data/store.json` içindeki `users` dizisini boşaltıp (`"users": []`) siteyi yeniden başlatın; `/admin/kurulum` tekrar açılır. Vercel Blob'da: Blob panelinden `dogubati/store.json` dosyasını indirip aynı düzenlemeyi yapıp geri yükleyin.

## İçerik güncelleme

Normal yol paneldir. Kaynak dosyaları değiştirecekseniz altı dosyanın yapısı eşit kalmalı:

```bash
node -e "const s=o=>Array.isArray(o)?o.map(s):typeof o==='object'?Object.fromEntries(Object.entries(o).map(([k,v])=>[k,s(v)])):'s';const t=JSON.stringify(s(require('./messages/tr.json')));for(const l of ['en','ru','ar','fa','de'])console.log(l,JSON.stringify(s(require('./messages/'+l+'.json')))===t?'ok':'FARKLI')"
```

Yeni ülke: `src/config/site.ts → countryIds` + `countryIso`, sonra altı mesaj dosyasında `countries.<id>` bloğu.

## Yayın

Vercel (önerilen): GitHub'a itin → Vercel'de içe aktarın → Storage'dan Blob oluşturup projeye bağlayın (`BLOB_READ_WRITE_TOKEN` otomatik gelir) → `.env.example` değişkenleri → alan adı. Ayrıntılı adımlar kılavuzda.

Kendi sunucusu (Node 20+): `npm ci && npm run build && npm start`; `DATA_DIR` ile veri klasörünü kalıcı bir yere alın; önüne Nginx/Caddy ile HTTPS.

## Doğrulama

```bash
npx tsc --noEmit && npx eslint . && npm run build
```
