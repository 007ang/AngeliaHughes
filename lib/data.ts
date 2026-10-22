import { client } from "@/sanity/client";
import { galleryUrl, posterUrl } from "@/sanity/image";
import {
  galleryQuery,
  postersQuery,
  selectedCreditsQuery,
  siteSettingsQuery,
  workVideosQuery,
} from "@/sanity/queries";
import {
  GALLERY,
  PORTRAIT,
  POSTERS,
  SELECTED_CREDITS,
  SITE,
  WORK_VIDEOS,
  type GalleryImage,
  type Poster,
  type SelectedCredit,
  type SiteSettings,
  type WorkVideo,
} from "@/lib/content";

export type SiteContent = {
  site: SiteSettings;
  /** The About photograph. Separate from `site` because its Sanity shape is an
   *  image object, not a settings field. */
  portrait: GalleryImage;
  gallery: GalleryImage[];
  credits: SelectedCredit[];
  posters: Poster[];
  videos: WorkVideo[];
  source: "sanity" | "fallback";
};

const FALLBACK: SiteContent = {
  site: SITE,
  portrait: PORTRAIT,
  gallery: GALLERY,
  credits: SELECTED_CREDITS,
  posters: POSTERS,
  videos: WORK_VIDEOS,
  source: "fallback",
};

/** Deriving this from the builder's own source type does not work: that type is
 *  a union including `string`, so intersecting it loses `asset`. Hotspot and
 *  crop are carried through deliberately — the hotspot is how she keeps her
 *  face in frame when the 4:5 crop bites. */
type SanityPortrait = {
  alt?: string;
  asset: { _ref: string; _type: string };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

type SanitySiteDoc = Partial<SiteSettings> & { portrait?: SanityPortrait };

type SanityPosterDoc = {
  _id: string;
  title: string;
  alt?: string;
  order?: number;
  image: Parameters<typeof posterUrl>[0];
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
    const [site, gallery, credits, posters, videos] = await Promise.all([
      client.fetch<SanitySiteDoc | null>(siteSettingsQuery),
      client.fetch<SanityGalleryDoc[]>(galleryQuery),
      client.fetch<SelectedCredit[]>(selectedCreditsQuery),
      client.fetch<SanityPosterDoc[]>(postersQuery),
      client.fetch<WorkVideo[]>(workVideosQuery),
    ]);

    // Pulled out before the spread: its shape is a Sanity image object, not a
    // SiteSettings field, so it must not land on `site`.
    const { portrait, ...siteFields } = site ?? {};

    return {
      // Field-level merge: a blank field in the Studio falls back rather than
      // rendering an empty contact row.
      site: { ...SITE, ...stripEmpty(siteFields) },
      portrait: portrait?.asset
        ? {
            src: galleryUrl(portrait, 1920),
            srcMobile: galleryUrl(portrait, 1280),
            alt: portrait.alt ?? PORTRAIT.alt,
            order: 1,
          }
        : PORTRAIT,
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
      credits: credits?.length ? credits : FALLBACK.credits,
      // Like videos, empty means "none uploaded yet", not "CMS not set up".
      posters: (posters ?? []).map((doc, i) => ({
        _id: doc._id,
        title: doc.title,
        src: posterUrl(doc.image, 800),
        alt: doc.alt ?? `Poster for ${doc.title}`,
        order: doc.order ?? i + 1,
      })),
      // Videos are genuinely empty until she sends links — an empty result here
      // means "none yet", not "CMS not set up", so it must not fall back.
      videos: videos ?? [],
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
