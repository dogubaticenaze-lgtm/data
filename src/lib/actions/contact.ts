"use server";

import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { getSite } from "@/lib/site";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "phone" | "email" | "message" | "consent", string>>;
};

/* ---------- Rate limiting (per-instance, in-memory; enough for a small site) ---------- */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

/* ---------- Validation ---------- */
const PHONE_RE = /^[+()\d\s.-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTROL_CHARS_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;

function clean(value: FormDataEntryValue | null, max = 500) {
  return String(value ?? "").replace(CONTROL_CHARS_RE, " ").trim().slice(0, max);
}

async function verifyTurnstile(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile is optional until the key is configured.
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip: ip ?? undefined }),
  });
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

async function deliver(subject: string, text: string) {
  const site = await getSite();
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? `Web Formu <form@${site.domain}>`;
  if (!apiKey) {
    // No mail provider configured yet: log so the message is not lost in development.
    console.info("[contact] RESEND_API_KEY missing; message logged only:\n" + text);
    return true;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
  return res.ok;
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const t = await getTranslations("form");

  // Honeypot: real users never fill this hidden field.
  if (clean(formData.get("website"))) return { status: "success", message: t("success") };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip");
  if (isRateLimited(ip ?? "unknown")) {
    return { status: "error", message: t("errors.rateLimit") };
  }

  const name = clean(formData.get("name"), 120);
  const phone = clean(formData.get("phone"), 40);
  const email = clean(formData.get("email"), 120);
  const deathPlace = clean(formData.get("deathPlace"), 120);
  const destination = clean(formData.get("destination"), 120);
  const message = clean(formData.get("message"), 2000);
  const company = clean(formData.get("company"), 120);
  const country = clean(formData.get("country"), 80);
  const requestType = clean(formData.get("requestType"), 40);
  const consent = formData.get("consent") === "on";
  const locale = clean(formData.get("locale"), 5);
  const page = clean(formData.get("page"), 200);
  const turnstileToken = clean(formData.get("cf-turnstile-response"), 2048);

  const errors: ContactState["errors"] = {};
  if (name.length < 2) errors.name = t("errors.name");
  if (!PHONE_RE.test(phone)) errors.phone = t("errors.phone");
  if (email && !EMAIL_RE.test(email)) errors.email = t("errors.email");
  if (message.length < 5) errors.message = t("errors.message");
  if (!consent) errors.consent = t("errors.consent");
  if (Object.keys(errors).length) return { status: "error", errors };

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return { status: "error", message: t("error") };
  }

  const lines = [
    `Ad Soyad: ${name}`,
    `Telefon: ${phone}`,
    email && `E-posta: ${email}`,
    requestType && `Talep türü: ${requestType}`,
    company && `Firma: ${company}`,
    country && `Ülke: ${country}`,
    deathPlace && `Vefat yeri: ${deathPlace}`,
    destination && `Gidilecek yer: ${destination}`,
    "",
    message,
    "",
    `Dil: ${locale}  |  Sayfa: ${page}  |  IP: ${ip ?? "-"}  |  ${new Date().toISOString()}`,
  ].filter((l): l is string => typeof l === "string");

  const ok = await deliver(`[Web] ${requestType || "form"}: ${name}`, lines.join("\n"));
  return ok
    ? { status: "success", message: t("success") }
    : { status: "error", message: t("error") };
}
