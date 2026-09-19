"use client";

import { useState, useSyncExternalStore } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Consent = "granted" | "denied";
type Snapshot = Consent | "none" | "pending";
const KEY = "cookie_consent";
const MAX_AGE = 60 * 60 * 24 * 180; // 6 months, then ask again

/* Tiny external store around document.cookie so rendering never sets state in an effect. */
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot(): Snapshot {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${KEY}=(granted|denied)`));
    return (m?.[1] as Consent) ?? "none";
  } catch {
    return "none";
  }
}
function getServerSnapshot(): Snapshot {
  return "pending";
}
function writeConsent(value: Consent) {
  try {
    document.cookie = `${KEY}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax; Secure`;
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

/**
 * KVKK cookie guide: "accept", "reject" and "manage" get equal prominence, and
 * measurement scripts never run before an explicit "granted".
 */
export function CookieConsent() {
  const t = useTranslations("cookie");
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  function decide(value: Consent) {
    writeConsent(value);
    setManage(false);
  }

  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? "https://plausible.io/js/script.js";

  return (
    <>
      {consent === "granted" && plausibleDomain && (
        <Script src={plausibleSrc} data-domain={plausibleDomain} strategy="afterInteractive" />
      )}

      {consent === "none" && (
        <div
          role="region"
          aria-label={t("title")}
          className="fixed inset-x-0 bottom-14 z-50 mx-auto max-w-2xl px-3 pb-3 md:bottom-4"
        >
          <div className="rounded-card border border-line bg-white p-5 shadow-card">
            <p className="font-semibold text-teal-950">{t("title")}</p>
            <p className="mt-1.5 text-sm text-ink-soft">
              {t("text")}{" "}
              <Link href="/cookie-policy" className="text-teal-700 underline underline-offset-4">
                {t("policyLink")}
              </Link>
            </p>

            {manage && (
              <div className="mt-4 space-y-3 rounded-lg bg-paper p-4 text-sm">
                <label className="flex items-start gap-3">
                  <input type="checkbox" checked disabled className="mt-1 size-4" />
                  <span>
                    <span className="font-medium">{t("necessary")}</span>
                    <br />
                    <span className="text-muted">{t("necessaryText")}</span>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="mt-1 size-4 accent-teal-700"
                  />
                  <span>
                    <span className="font-medium">{t("analytics")}</span>
                    <br />
                    <span className="text-muted">{t("analyticsText")}</span>
                  </span>
                </label>
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {manage ? (
                <button
                  type="button"
                  onClick={() => decide(analytics ? "granted" : "denied")}
                  className="btn-secondary min-h-10 text-sm sm:col-span-3"
                >
                  {t("save")}
                </button>
              ) : (
                <>
                  <button type="button" onClick={() => decide("granted")} className="btn-secondary min-h-10 text-sm">
                    {t("accept")}
                  </button>
                  <button type="button" onClick={() => decide("denied")} className="btn-secondary min-h-10 text-sm">
                    {t("reject")}
                  </button>
                  <button type="button" onClick={() => setManage(true)} className="btn-outline min-h-10 text-sm">
                    {t("manage")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
