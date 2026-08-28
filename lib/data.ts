import { client } from "@/sanity/client";
import { galleryUrl } from "@/sanity/image";
import {
  departmentsQuery,
  galleryQuery,
  siteSettingsQuery,
  upcomingQuery,
} from "@/sanity/queries";
import {
  DEPARTMENTS,
  GALLERY,
  SITE,
  UPCOMING,
  type Department,
  type GalleryImage,
  type SiteSettings,
  type Upcoming,
} from "@/lib/content";

export type SiteContent = {
  site: SiteSettings;
  gallery: GalleryImage[];
  departments: Department[];
  upcoming: Upcoming[];
  source: "sanity" | "fallback";
};

const FALLBACK: SiteContent = {
  site: SITE,
  gallery: GALLERY,
  departments: DEPARTMENTS,
  upcoming: UPCOMING,
  source: "fallback",
};

type SanityGalleryDoc = {
  _id: string;
  alt: string;
  productionName?: string;
  order?: number;
  image: Parameters<typeof galleryUrl>[0];
};

/**
 * Sanity is the source of truth once it has content, and the hardcoded credits
 * are the floor. An empty result is treated as "not set up yet", not as
 * "she has no credits" — a half-provisioned CMS must never blank the page
 * during festival week.
 */
export async function getSiteContent(): Promise<SiteContent> {
  if (!client) return FALLBACK;

  try {
    const [site, gallery, departments, upcoming] = await Promise.all([
      client.fetch<Partial<SiteSettings> | null>(siteSettingsQuery),
      client.fetch<SanityGalleryDoc[]>(galleryQuery),
      client.fetch<Department[]>(departmentsQuery),
      client.fetch<Upcoming[]>(upcomingQuery),
    ]);

    return {
      // Field-level merge: a blank field in the Studio falls back rather than
      // rendering an empty contact row.
      site: { ...SITE, ...stripEmpty(site) },
      gallery: gallery?.length
        ? gallery.map((doc, i) => ({
            _id: doc._id,
            src: galleryUrl(doc.image, 1920),
            srcMobile: galleryUrl(doc.image, 1280),
            alt: doc.alt,
            productionName: doc.productionName,
            order: doc.order ?? i + 1,
          }))
        : FALLBACK.gallery,
      departments: departments?.length ? departments : FALLBACK.departments,
      upcoming: upcoming?.length ? upcoming : FALLBACK.upcoming,
      source: "sanity",
    };
  } catch (error) {
    console.error("[sanity] fetch failed, serving fallback content:", error);
    return FALLBACK;
  }
}

function stripEmpty<T extends object>(obj: T | null): Partial<T> {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== ""),
  ) as Partial<T>;
}
