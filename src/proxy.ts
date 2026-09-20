import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

/** Next.js 16: the request interceptor is `proxy.ts`. */
export default function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  // Skip the admin panel, API, static files, downloads, Next internals and metadata routes.
  matcher: [
    "/((?!admin|api|_next|_vercel|downloads|sitemap\\.xml|robots\\.txt|og\\.png|.*\\..*).*)",
  ],
};
