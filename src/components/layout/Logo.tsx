/**
 * Wordmark. Replace with the registered logo once the owner supplies it
 * (keep a monochrome version for the dark header).
 */
export function Logo({ light = true }: { light?: boolean }) {
  const text = light ? "text-white" : "text-teal-950";
  const sub = light ? "text-teal-100/80" : "text-muted";
  return (
    <span className="flex items-center gap-3">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        aria-hidden="true"
        focusable="false"
        className="shrink-0"
      >
        <circle cx="20" cy="20" r="19" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
        <path d="M20 5v30M5 20h30" stroke="#D4AF37" strokeWidth="1.25" strokeLinecap="round" />
        <path
          d="M20 9a11 11 0 0 1 0 22 11 11 0 0 1 0-22z"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.25"
        />
        <path d="M20 9c-4 3-4 19 0 22" fill="none" stroke="#D4AF37" strokeWidth="1" />
        <path d="M20 9c4 3 4 19 0 22" fill="none" stroke="#D4AF37" strokeWidth="1" />
      </svg>
      <span className="leading-tight">
        <span className={`block text-base font-semibold tracking-wide ${text}`}>Doğu Batı</span>
        <span className={`hidden whitespace-nowrap text-[0.7rem] uppercase tracking-[0.16em] sm:block xl:hidden 2xl:block ${sub}`}>
          Uluslararası Cenaze Hizmetleri
        </span>
      </span>
    </span>
  );
}
