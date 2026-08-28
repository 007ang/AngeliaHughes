import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/** One page, so one entry. The Studio is deliberately absent. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
