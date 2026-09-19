"use client";

import { useActionState, useId } from "react";
import Script from "next/script";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { submitContact, type ContactState } from "@/lib/actions/contact";

const initial: ContactState = { status: "idle" };

export function ContactForm({ variant = "family" }: { variant?: "family" | "corporate" }) {
  const t = useTranslations("form");
  const locale = useLocale();
  const pathname = usePathname();
  const [state, action, pending] = useActionState(submitContact, initial);
  const id = useId();
  const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const field = "mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink focus:border-teal-700";
  const label = "block text-sm font-medium text-ink";
  const err = "mt-1 text-sm text-red-700";

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-card border border-teal-700/30 bg-teal-50 p-6 text-teal-950">
        <p className="font-semibold">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="page" value={pathname} />
      <input type="hidden" name="requestType" value={variant === "corporate" ? "" : "family"} />
      {/* Honeypot: hidden from people, visible to bots. */}
      <div className="sr-only" aria-hidden="true">
        <label>
          website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {variant === "corporate" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-company`} className={label}>{t("company")}</label>
            <input id={`${id}-company`} name="company" className={field} autoComplete="organization" />
          </div>
          <div>
            <label htmlFor={`${id}-country`} className={label}>{t("country")}</label>
            <input id={`${id}-country`} name="country" className={field} autoComplete="country-name" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={`${id}-type`} className={label}>{t("requestType")}</label>
            <select id={`${id}-type`} name="requestType" className={field} defaultValue="insurance">
              <option value="insurance">{t("requestTypes.insurance")}</option>
              <option value="funeralHome">{t("requestTypes.funeralHome")}</option>
              <option value="hospital">{t("requestTypes.hospital")}</option>
              <option value="consulate">{t("requestTypes.consulate")}</option>
              <option value="other">{t("requestTypes.other")}</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={label}>{t("name")}</label>
          <input
            id={`${id}-name`}
            name="name"
            required
            className={field}
            autoComplete="name"
            aria-invalid={Boolean(state.errors?.name)}
          />
          {state.errors?.name && <p className={err}>{state.errors.name}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className={label}>{t("phone")}</label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            required
            className={field}
            autoComplete="tel"
            dir="ltr"
            aria-invalid={Boolean(state.errors?.phone)}
          />
          {state.errors?.phone && <p className={err}>{state.errors.phone}</p>}
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-email`} className={label}>{t("email")}</label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          className={field}
          autoComplete="email"
          dir="ltr"
          aria-invalid={Boolean(state.errors?.email)}
        />
        {state.errors?.email && <p className={err}>{state.errors.email}</p>}
      </div>

      {variant === "family" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-place`} className={label}>{t("deathPlace")}</label>
            <input id={`${id}-place`} name="deathPlace" className={field} />
          </div>
          <div>
            <label htmlFor={`${id}-dest`} className={label}>{t("destination")}</label>
            <input id={`${id}-dest`} name="destination" className={field} />
          </div>
        </div>
      )}

      <div>
        <label htmlFor={`${id}-msg`} className={label}>{t("message")}</label>
        <textarea
          id={`${id}-msg`}
          name="message"
          rows={4}
          required
          className={field}
          aria-invalid={Boolean(state.errors?.message)}
        />
        {state.errors?.message && <p className={err}>{state.errors.message}</p>}
        <p className="mt-1.5 text-xs text-muted">{t("sensitiveNote")}</p>
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input type="checkbox" name="consent" className="mt-1 size-4 shrink-0 accent-teal-700" />
          <span>
            {t("consent")}{" "}
            <Link href="/privacy-notice" className="text-teal-700 underline underline-offset-4">
              {t("consentLink")}
            </Link>
          </span>
        </label>
        {state.errors?.consent && <p className={err}>{state.errors.consent}</p>}
      </div>

      {turnstileKey && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile" data-sitekey={turnstileKey} data-size="flexible" />
        </>
      )}

      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-secondary w-full disabled:opacity-60 sm:w-auto">
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
