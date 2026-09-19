"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "./guard";
import {
  changePassword,
  clearFailures,
  clientKey,
  createSession,
  createUser,
  deleteUser,
  destroySession,
  hasAnyAdmin,
  isLocked,
  noteFailure,
  readStoreUsers,
  resetPassword,
  verifyPassword,
} from "@/lib/auth";
import { newId, updateStore, type CaseStatus } from "@/lib/store";
import { baseMessages } from "@/lib/messages";
import { flatten } from "@/lib/content";
import { routing, type AppLocale } from "@/i18n/routing";
import { slugify } from "@/lib/markdown";

const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? "").trim().slice(0, max);
const num = (fd: FormData, k: string) => {
  const v = str(fd, k, 20).replace(/\D/g, "");
  return v ? Number(v) : null;
};
const bool = (fd: FormData, k: string) => fd.get(k) === "on";

/** Redirect back with a notice; `redirect` throws, so it is always the last statement. */
function back(path: string, ok: boolean, msg?: string): never {
  const q = ok ? "ok=1" : `err=${encodeURIComponent(msg ?? "Hata")}`;
  redirect(`${path}${path.includes("?") ? "&" : "?"}${q}`);
}

function refreshSite() {
  revalidatePath("/", "layout");
}

async function attempt(path: string, fn: () => Promise<void>): Promise<never> {
  let error: string | null = null;
  try {
    await fn();
  } catch (e) {
    error = e instanceof Error ? e.message : "Beklenmeyen hata";
  }
  if (error) back(path, false, error);
  back(path, true);
}

/* ---------------- auth ---------------- */
export async function setupAction(fd: FormData) {
  if (await hasAnyAdmin()) redirect("/admin/giris");
  const username = str(fd, "username", 64);
  const password = str(fd, "password", 200);
  const confirm = str(fd, "confirm", 200);
  let error: string | null = null;
  try {
    if (password !== confirm) throw new Error("Şifreler birbirini tutmuyor.");
    const u = await createUser(username, password);
    await createSession(u.id);
  } catch (e) {
    error = e instanceof Error ? e.message : "Hata";
  }
  if (error) back("/admin/kurulum", false, error);
  redirect("/admin?ok=1");
}

export async function loginAction(fd: FormData) {
  const key = await clientKey();
  if (isLocked(key)) back("/admin/giris", false, "Çok fazla hatalı deneme. 15 dakika sonra tekrar deneyin.");
  const username = str(fd, "username", 64).toLowerCase();
  const password = str(fd, "password", 200);
  const users = await readStoreUsers();
  const u = users.find((x) => x.username === username);
  if (!u || !verifyPassword(password, u.passwordHash)) {
    noteFailure(key);
    back("/admin/giris", false, "Kullanıcı adı veya şifre hatalı.");
  }
  clearFailures(key);
  await createSession(u.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/giris");
}

/* ---------------- settings ---------------- */
export async function saveSettingsAction(fd: FormData) {
  await requireUser();
  return attempt("/admin/sirket", async () => {
    const phones = [1, 2, 3]
      .map((i) => ({ display: str(fd, `phone${i}_display`, 40), e164: str(fd, `phone${i}_e164`, 20).replace(/[^\d+]/g, ""), primary: i === 1 }))
      .filter((p) => p.display && p.e164);
    if (!phones.length) throw new Error("En az bir telefon numarası gerekli.");
    for (const p of phones) if (!/^\+\d{8,15}$/.test(p.e164)) throw new Error(`Uluslararası biçim hatalı: ${p.e164} (örn. +905344504862)`);
    const whatsapp = str(fd, "whatsapp", 20).replace(/\D/g, "");
    if (!/^\d{10,15}$/.test(whatsapp)) throw new Error("WhatsApp numarası ülke koduyla ve sadece rakam olmalı (örn. 905344504862).");
    const email = str(fd, "email", 120);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new Error("E-posta adresi geçersiz.");
    const sameAs = str(fd, "sameAs", 2000)
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    for (const u of sameAs) if (!/^https?:\/\//.test(u)) throw new Error(`Bağlantı https:// ile başlamalı: ${u}`);
    const lat = str(fd, "lat", 20);
    const lng = str(fd, "lng", 20);
    const geo = lat && lng ? { lat: Number(lat.replace(",", ".")), lng: Number(lng.replace(",", ".")) } : null;
    if (geo && (Number.isNaN(geo.lat) || Number.isNaN(geo.lng))) throw new Error("Koordinatlar sayı olmalı.");

    await updateStore((s) => {
      s.settings = {
        legalName: str(fd, "legalName", 160),
        phones,
        whatsapp,
        email,
        address: {
          street: str(fd, "street", 200),
          district: str(fd, "district", 80),
          city: str(fd, "city", 80),
          postalCode: str(fd, "postalCode", 10),
          mapsUrl: str(fd, "mapsUrl", 500),
          geo,
        },
        facts: {
          foundedYear: num(fd, "foundedYear"),
          completedTransfers: num(fd, "completedTransfers"),
          countriesServed: num(fd, "countriesServed"),
        },
        registry: {
          taxOffice: str(fd, "taxOffice", 80) || null,
          taxNumber: str(fd, "taxNumber", 20) || null,
          mersis: str(fd, "mersis", 20) || null,
          tradeRegistry: str(fd, "tradeRegistry", 40) || null,
          kep: str(fd, "kep", 120) || null,
          hosting: str(fd, "hosting", 160) || null,
        },
        sameAs,
      };
    });
    refreshSite();
  });
}

export async function saveFlagsAction(fd: FormData) {
  await requireUser();
  return attempt("/admin/ayarlar", async () => {
    await updateStore((s) => {
      s.flags = {
        showPriceRanges: bool(fd, "showPriceRanges"),
        showReviews: bool(fd, "showReviews"),
        showCaseTracking: bool(fd, "showCaseTracking"),
      };
    });
    refreshSite();
  });
}

/* ---------------- content overrides ---------------- */
export async function saveContentAction(fd: FormData) {
  await requireUser();
  const locale = str(fd, "locale", 5) as AppLocale;
  const section = str(fd, "section", 60);
  const path = `/admin/metinler?dil=${locale}&bolum=${encodeURIComponent(section)}`;
  return attempt(path, async () => {
    if (!routing.locales.includes(locale)) throw new Error("Geçersiz dil.");
    const base = flatten(baseMessages[locale] as never);
    await updateStore((s) => {
      const bucket = { ...(s.content[locale] ?? {}) };
      for (const [k, v] of fd.entries()) {
        if (!k.startsWith("c:")) continue;
        const key = k.slice(2);
        if (!(key in base)) continue;
        const value = String(v).replace(/\r\n?/g, "\n").trim();
        if (!value || value === base[key]) delete bucket[key];
        else bucket[key] = value.slice(0, 5000);
      }
      s.content[locale] = bucket;
    });
    refreshSite();
  });
}

export async function resetContentAction(fd: FormData) {
  await requireUser();
  const locale = str(fd, "locale", 5) as AppLocale;
  const section = str(fd, "section", 60);
  const path = `/admin/metinler?dil=${locale}&bolum=${encodeURIComponent(section)}`;
  return attempt(path, async () => {
    await updateStore((s) => {
      const bucket = s.content[locale] ?? {};
      for (const k of Object.keys(bucket)) if (k === section || k.startsWith(section + ".")) delete bucket[k];
      s.content[locale] = bucket;
    });
    refreshSite();
  });
}

/* ---------------- reviews ---------------- */
export async function saveReviewAction(fd: FormData) {
  await requireUser();
  return attempt("/admin/yorumlar", async () => {
    const id = str(fd, "id", 32);
    const text = str(fd, "text", 1200);
    const name = str(fd, "name", 80);
    if (text.length < 10) throw new Error("Yorum metni çok kısa.");
    if (name.length < 2) throw new Error("Ad gerekli (örn. A. K.).");
    const date = str(fd, "date", 10) || new Date().toISOString().slice(0, 10);
    await updateStore((s) => {
      const review = {
        id: id || newId(),
        name,
        country: str(fd, "country", 60),
        locale: str(fd, "locale", 5) || "tr",
        text,
        source: str(fd, "source", 40),
        date,
        consent: bool(fd, "consent"),
        published: bool(fd, "published"),
      };
      const idx = s.reviews.findIndex((r) => r.id === review.id);
      if (idx >= 0) s.reviews[idx] = review;
      else s.reviews.push(review);
    });
    refreshSite();
  });
}

export async function deleteReviewAction(fd: FormData) {
  await requireUser();
  return attempt("/admin/yorumlar", async () => {
    const id = str(fd, "id", 32);
    await updateStore((s) => {
      s.reviews = s.reviews.filter((r) => r.id !== id);
    });
    refreshSite();
  });
}

/* ---------------- posts ---------------- */
export async function savePostAction(fd: FormData) {
  await requireUser();
  const id = str(fd, "id", 32);
  const path = id ? `/admin/yazilar/${id}` : "/admin/yazilar";
  let newIdCreated = "";
  let error: string | null = null;
  try {
    const title = str(fd, "title", 160);
    const body = str(fd, "body", 30000);
    const locale = str(fd, "locale", 5);
    if (!routing.locales.includes(locale as AppLocale)) throw new Error("Geçersiz dil.");
    if (title.length < 3) throw new Error("Başlık gerekli.");
    if (body.length < 20) throw new Error("Yazı içeriği çok kısa.");
    const slug = slugify(str(fd, "slug", 100) || title) || newId();
    const date = str(fd, "date", 10) || new Date().toISOString().slice(0, 10);
    await updateStore((s) => {
      if (s.posts.some((p) => p.id !== id && p.locale === locale && p.slug === slug)) throw new Error("Bu dilde aynı adresli (slug) bir yazı zaten var.");
      const existing = s.posts.find((p) => p.id === id);
      const post = {
        id: id || newId(),
        locale,
        slug,
        title,
        excerpt: str(fd, "excerpt", 300),
        body,
        date,
        updatedAt: new Date().toISOString(),
        published: bool(fd, "published"),
      };
      if (existing) Object.assign(existing, post);
      else {
        s.posts.push(post);
        newIdCreated = post.id;
      }
    });
    refreshSite();
  } catch (e) {
    error = e instanceof Error ? e.message : "Hata";
  }
  if (error) back(path, false, error);
  redirect(`/admin/yazilar/${id || newIdCreated}?ok=1`);
}

export async function deletePostAction(fd: FormData) {
  await requireUser();
  const id = str(fd, "id", 32);
  await updateStore((s) => {
    s.posts = s.posts.filter((p) => p.id !== id);
  });
  refreshSite();
  redirect("/admin/yazilar?ok=1");
}

/* ---------------- cases ---------------- */
const STATUSES: CaseStatus[] = ["received", "documents", "preparation", "consulate", "flight", "delivered"];

function makeCode() {
  const y = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `DB-${y}-${n}`;
}

export async function saveCaseAction(fd: FormData) {
  await requireUser();
  const id = str(fd, "id", 32);
  let created = "";
  let error: string | null = null;
  try {
    const label = str(fd, "label", 120);
    const route = str(fd, "route", 120);
    if (!route) throw new Error("Güzergâh gerekli (örn. İstanbul → Berlin).");
    const status = str(fd, "status", 20) as CaseStatus;
    if (!STATUSES.includes(status)) throw new Error("Geçersiz durum.");
    const note = str(fd, "note", 500);
    const now = new Date().toISOString();
    await updateStore((s) => {
      const existing = s.cases.find((c) => c.id === id);
      if (existing) {
        const changed = existing.status !== status || existing.note !== note;
        existing.label = label;
        existing.route = route;
        existing.status = status;
        existing.note = note;
        if (changed) existing.updates.push({ at: now, status, note });
        existing.updatedAt = now;
      } else {
        let code = str(fd, "code", 20).toUpperCase() || makeCode();
        while (s.cases.some((c) => c.code === code)) code = makeCode();
        const c = { id: newId(), code, label, route, status, note, updates: [{ at: now, status, note }], createdAt: now, updatedAt: now };
        s.cases.push(c);
        created = c.id;
      }
    });
    refreshSite();
  } catch (e) {
    error = e instanceof Error ? e.message : "Hata";
  }
  if (error) back(id ? `/admin/dosyalar/${id}` : "/admin/dosyalar", false, error);
  redirect(`/admin/dosyalar/${id || created}?ok=1`);
}

export async function deleteCaseAction(fd: FormData) {
  await requireUser();
  const id = str(fd, "id", 32);
  await updateStore((s) => {
    s.cases = s.cases.filter((c) => c.id !== id);
  });
  refreshSite();
  redirect("/admin/dosyalar?ok=1");
}

/* ---------------- users ---------------- */
export async function addUserAction(fd: FormData) {
  await requireUser();
  return attempt("/admin/kullanicilar", async () => {
    const pw = str(fd, "password", 200);
    if (pw !== str(fd, "confirm", 200)) throw new Error("Şifreler birbirini tutmuyor.");
    await createUser(str(fd, "username", 64), pw);
  });
}

export async function changePasswordAction(fd: FormData) {
  const me = await requireUser();
  return attempt("/admin/kullanicilar", async () => {
    const next = str(fd, "next", 200);
    if (next !== str(fd, "confirm", 200)) throw new Error("Yeni şifreler birbirini tutmuyor.");
    await changePassword(me.id, str(fd, "current", 200), next);
  });
}

export async function resetUserPasswordAction(fd: FormData) {
  await requireUser();
  return attempt("/admin/kullanicilar", async () => {
    await resetPassword(str(fd, "id", 32), str(fd, "password", 200));
  });
}

export async function deleteUserAction(fd: FormData) {
  const me = await requireUser();
  return attempt("/admin/kullanicilar", async () => {
    await deleteUser(str(fd, "id", 32), me.id);
  });
}
