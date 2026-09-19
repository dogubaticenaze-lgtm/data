import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "../globals.css";

const plex = IBM_Plex_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], variable: "--font-plex", display: "swap" });

export const metadata: Metadata = {
  title: "Yönetim Paneli | Doğu Batı",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" dir="ltr" data-font="latin" className={`${plex.variable} h-full`}>
      <body className="min-h-full bg-paper">{children}</body>
    </html>
  );
}
