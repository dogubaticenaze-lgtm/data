import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // A stray package-lock.json in the user's home directory would otherwise be picked as the workspace root.
  turbopack: { root: process.cwd() },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  /**
   * Legacy URLs of the 2022 static site. `statusCode: 301` (not `permanent: true`, which
   * emits 308) so search engines transfer the old pages' signals to the new ones.
   */
  async redirects() {
    return [
      { source: "/index.html", destination: "/", statusCode: 301 },
      { source: "/aboutus.html", destination: "/hakkimizda", statusCode: 301 },
      { source: "/services.html", destination: "/hizmetler", statusCode: 301 },
      { source: "/gallery.html", destination: "/hakkimizda", statusCode: 301 },
      { source: "/contact.html", destination: "/iletisim", statusCode: 301 },
      // Turkish must never carry a /tr prefix (duplicate content).
      { source: "/tr", destination: "/", statusCode: 301 },
      { source: "/tr/:path*", destination: "/:path*", statusCode: 301 },
    ];
  },
};

export default withNextIntl(nextConfig);
