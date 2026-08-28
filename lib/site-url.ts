/**
 * The site's absolute base URL, resolved at build time.
 *
 * Without this, Next resolves og:image against http://localhost:3000 and every
 * shared link ships a broken card. Vercel exposes the production domain during
 * the build; set NEXT_PUBLIC_SITE_URL once a custom domain exists and it wins.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
