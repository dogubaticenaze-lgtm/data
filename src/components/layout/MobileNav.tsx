"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { CloseIcon, MenuIcon } from "../icons";

export type NavLink = {
  href: StaticPathname;
  label: string;
};

export function MobileNav({
  links,
  labels,
  children,
}: {
  links: NavLink[];
  labels: { menu: string; close: string };
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const menu = open
    ? createPortal(
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={labels.menu}
          className="fixed inset-0 z-[9999] flex h-dvh w-screen flex-col overflow-hidden bg-teal-950 text-white"
        >
          {/* Menü üst barı */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
            <span className="text-xl font-bold">{labels.menu}</span>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label={labels.close}
            >
              <CloseIcon size={28} />
            </button>
          </div>

          {/* Menü içeriği */}
          <nav className="flex-1 overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
            {/* Dil seçimi */}
            {children && (
              <div className="border-b border-white/15 py-5">
                <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-teal-100/70">
                  Dil / Language
                </div>

                <div className="rounded-2xl bg-white/10 p-3">
                  {children}
                </div>
              </div>
            )}

            {/* Ana menü */}
            <ul className="divide-y divide-white/10">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 text-lg font-medium text-white hover:text-gold-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="inline-flex size-11 items-center justify-center rounded-full text-white hover:bg-white/10"
        >
          <MenuIcon size={24} />
          <span className="sr-only">{labels.menu}</span>
        </button>
      </div>

      {menu}
    </>
  );
}
