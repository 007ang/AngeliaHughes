import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { SITE } from "@/lib/content";
import "./globals.css";

/** Archivo carries over from the wordmark. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

/**
 * Camera reports and call sheets are set in mono. Using one for every figure
 * makes the data sections read as documents from her working life rather than
 * as styled web tables. IBM Plex Mono is the identity's own mono.
 */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

/**
 * Without this, Next resolves og:image against http://localhost:3000 and every
 * shared link ships a broken card. Vercel exposes the production domain at
 * build time; NEXT_PUBLIC_SITE_URL overrides it once a custom domain exists.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${SITE.name} — Camera Operator · ${SITE.location}`,
  description: SITE.seoDescription,
  openGraph: {
    title: `${SITE.name} — Camera Operator · ${SITE.location}`,
    description: SITE.seoDescription,
    type: "profile",
    locale: "en_CA",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#16140F",
  colorScheme: "dark" as const,
};

/**
 * She is credited under both "Angelia" and "Angela" — without alternateName
 * she is only half-findable, which matters when producers google her during
 * the festival.
 */
function PersonJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    alternateName: "Angela Hughes",
    jobTitle: ["Camera Operator", "Director"],
    description: SITE.seoDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.location,
      addressRegion: "ON",
      addressCountry: "CA",
    },
    email: `mailto:${SITE.email}`,
    sameAs: [SITE.imdbUrl, SITE.linkedinUrl],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable} antialiased`}
    >
      <head>
        {/* Without JS the splash can never dismiss itself, so it must not
            exist. This is the only thing standing between a no-JS visitor
            and a permanently black page. */}
        <noscript>
          <style>{`.splash-root{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <PersonJsonLd />
        {children}
      </body>
    </html>
  );
}
