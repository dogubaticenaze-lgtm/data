/** Helpers to overlay admin text edits on top of the JSON message files. */

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

export function flatten(obj: Json, prefix = "", out: Record<string, string> = {}): Record<string, string> {
  if (typeof obj === "string") {
    out[prefix] = obj;
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => flatten(v, prefix ? `${prefix}.${i}` : String(i), out));
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

export function setPath(target: Record<string, unknown>, path: string, value: string) {
  const parts = path.split(".");
  let cur: unknown = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (Array.isArray(cur)) cur = cur[Number(key)];
    else if (cur && typeof cur === "object") cur = (cur as Record<string, unknown>)[key];
    else return;
    if (cur === undefined) return; // never create new branches; the schema is fixed
  }
  const last = parts[parts.length - 1];
  if (Array.isArray(cur)) {
    const idx = Number(last);
    if (typeof cur[idx] === "string") cur[idx] = value;
  } else if (cur && typeof cur === "object") {
    const rec = cur as Record<string, unknown>;
    if (typeof rec[last] === "string") rec[last] = value;
  }
}

/** Returns a deep copy of `messages` with every override applied. */
export function applyOverrides<T extends object>(messages: T, overrides: Record<string, string> | undefined): T {
  if (!overrides || !Object.keys(overrides).length) return messages;
  const copy = JSON.parse(JSON.stringify(messages)) as Record<string, unknown>;
  for (const [path, value] of Object.entries(overrides)) setPath(copy, path, value);
  return copy as T;
}

/** Namespaces exposed in the admin text editor, with human labels. */
export const editableSections: { key: string; label: string }[] = [
  { key: "home", label: "Anasayfa" },
  { key: "nav", label: "Menü" },
  { key: "common", label: "Ortak düğme ve etiketler" },
  { key: "meta", label: "Site başlığı ve açıklaması (arama motoru)" },
  { key: "process", label: "Süreç adımları" },
  { key: "pages.services", label: "Hizmetler sayfası" },
  { key: "pages.outbound", label: "Türkiye'den yurt dışına" },
  { key: "pages.inbound", label: "Yurt dışından Türkiye'ye" },
  { key: "pages.transit", label: "Transit nakil" },
  { key: "pages.domestic", label: "Yurt içi nakil" },
  { key: "pages.documents", label: "Evrak ve konsolosluk" },
  { key: "pages.process", label: "Süreç sayfası" },
  { key: "pages.guide", label: "Vefat oldu, ne yapmalıyım?" },
  { key: "pages.countries", label: "Ülkeler sayfası (başlıklar)" },
  { key: "countries", label: "Ülke sayfaları" },
  { key: "pages.coffins", label: "Tabut ve hazırlık" },
  { key: "pages.partners", label: "Kurumsal" },
  { key: "pages.about", label: "Hakkımızda" },
  { key: "pages.contact", label: "İletişim" },
  { key: "pages.faq", label: "Sık sorulan sorular" },
  { key: "pages.costGuide", label: "Maliyet rehberi" },
  { key: "pages.nonMuslim", label: "Müslüman olmayanlar için hizmetler" },
  { key: "pages.downloads", label: "İndirilebilir belgeler" },
  { key: "pages.guides", label: "Rehber yazıları (sayfa başlıkları)" },
  { key: "pages.tracking", label: "Dosya takip" },
  { key: "reviews", label: "Yorumlar bölümü" },
  { key: "form", label: "Form metinleri" },
  { key: "cookie", label: "Çerez bildirimi" },
  { key: "footer", label: "Alt bilgi" },
  { key: "legal", label: "Yasal metinler" },
];
