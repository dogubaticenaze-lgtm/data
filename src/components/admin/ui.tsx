import type { ReactNode } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/admin/actions";
import { SubmitButton } from "./SubmitButton";

export const adminNav = [
  { href: "/admin", label: "Genel bakış" },
  { href: "/admin/sirket", label: "Şirket bilgileri" },
  { href: "/admin/metinler", label: "Site metinleri" },
  { href: "/admin/yorumlar", label: "Yorumlar" },
  { href: "/admin/yazilar", label: "Rehber yazıları" },
  { href: "/admin/dosyalar", label: "Dosya takip" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar ve şifre" },
  { href: "/admin/ayarlar", label: "Ayarlar" },
];

export function Shell({ children, username, current }: { children: ReactNode; username: string; current?: string }) {
  return (
    <div className="min-h-full bg-paper text-ink">
      <header className="bg-teal-950 text-white">
        <div className="container-x flex h-14 items-center justify-between gap-4">
          <Link href="/admin" className="font-semibold">
            Doğu Batı · Yönetim Paneli
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <a href="/" target="_blank" rel="noopener" className="text-teal-100 hover:text-white">
              Siteyi aç ↗
            </a>
            <span className="hidden text-teal-100/70 sm:inline">{username}</span>
            <form action={logoutAction}>
              <button type="submit" className="rounded-full border border-white/30 px-3 py-1 hover:bg-white/10">
                Çıkış
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="container-x grid gap-8 py-8 lg:grid-cols-[14rem_1fr]">
        <nav aria-label="Panel" className="lg:sticky lg:top-6 lg:self-start">
          <ul className="flex flex-wrap gap-1 lg:flex-col">
            {adminNav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`block rounded-lg px-3 py-2 text-sm ${current === n.href ? "bg-teal-950 font-semibold text-white" : "text-teal-950 hover:bg-white"}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="min-w-0 space-y-6">{children}</main>
      </div>
    </div>
  );
}

export function PageTitle({ title, text }: { title: string; text?: string }) {
  return (
    <div>
      <h1 className="text-2xl text-teal-950">{title}</h1>
      {text && <p className="mt-1 text-ink-soft">{text}</p>}
    </div>
  );
}

export function Card({ children, title, className = "" }: { children: ReactNode; title?: string; className?: string }) {
  return (
    <section className={`rounded-card border border-line bg-white p-6 shadow-card ${className}`}>
      {title && <h2 className="mb-4 text-lg text-teal-950">{title}</h2>}
      {children}
    </section>
  );
}

export function Notice({ ok, err }: { ok?: string; err?: string }) {
  if (ok) return <p role="status" className="rounded-lg border border-teal-700/30 bg-teal-50 px-4 py-3 text-sm text-teal-950">Kaydedildi. Değişiklik sitede yayında.</p>;
  if (err) return <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</p>;
  return null;
}

const inputCls = "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-ink focus:border-teal-700";

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  hint,
  placeholder,
  required,
  dir,
  autoComplete,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  hint?: string;
  placeholder?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        dir={dir}
        autoComplete={autoComplete}
        className={inputCls}
      />
      {hint && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
  hint,
  dir,
  mono,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
  dir?: "ltr" | "rtl" | "auto";
  mono?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <textarea name={name} defaultValue={defaultValue ?? ""} rows={rows} dir={dir} className={`${inputCls} ${mono ? "font-mono text-sm" : ""}`} />
      {hint && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <select name={name} defaultValue={defaultValue} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Checkbox({ label, name, defaultChecked, hint }: { label: string; name: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex items-start gap-3 text-sm text-ink">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 size-4 accent-teal-700" />
      <span>
        <span className="font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export { SubmitButton };
