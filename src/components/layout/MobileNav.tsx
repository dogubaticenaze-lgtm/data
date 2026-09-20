"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { CloseIcon, MenuIcon } from "../icons";
import type { ReactNode } from "react";

export type NavLink = { href: StaticPathname; label: string };

export function MobileNav({
  links,
  labels,
  children,
}: {
  links: NavLink[];
  labels: { menu: string; close: string };
  children?: ReactNode; // language switcher + call button
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
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

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col bg-teal-950 text-white"
        >
          <div className="container-x flex h-16 items-center justify-between">
            <span className="font-semibold">{labels.menu}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/10"
            >
              <CloseIcon size={24} />
              <span className="sr-only">{labels.close}</span>
            </button>
          </div>
          <nav className="container-x flex-1 overflow-y-auto py-4">
  <div className="mb-6 border-b border-white/10 pb-5">
    {children}
  </div>

  <ul className="divide-y divide-white/10">
    {links.map((l) => (
      <li key={l.href}>
        <Link
          href={l.href}
          onClick={() => setOpen(false)}
          className="block py-3.5 text-lg hover:text-gold-300"
        >
          {l.label}
        </Link>
      </li>
    ))}
  </ul>
</nav>
        </div>
      )}
    </div>
  );
}
