"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "danger" | "outline" }) {
  const { pending } = useFormStatus();
  const cls =
    variant === "danger"
      ? "btn bg-red-700 text-white hover:bg-red-800"
      : variant === "outline"
        ? "btn-outline"
        : "btn-secondary";
  return (
    <button type="submit" disabled={pending} className={`${cls} min-h-10 px-4 py-2 text-sm disabled:opacity-60`}>
      {pending ? "Kaydediliyor..." : children}
    </button>
  );
}
