import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The Studio is her editing surface, not content. The route already
      // carries a noindex tag; this keeps crawlers away from it entirely.
      disallow: "/studio/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
