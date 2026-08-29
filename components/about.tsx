import type { GalleryImage, SiteSettings } from "@/lib/content";

/**
 * Bio and portrait. This is now the site's primary indexable text — the credit
 * tables that used to carry that weight are gone — so the copy needs to keep
 * "camera operator", "director" and "Toronto" in it through any rewrite.
 */
export function About({
  site,
  portrait,
}: {
  site: SiteSettings;
  portrait: GalleryImage;
}) {
  return (
    <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-12">
      <div className="md:col-span-7 md:order-1">
        {site.bio.length > 0 ? (
          site.bio.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="max-w-[54ch] text-lg leading-relaxed text-bone [&+p]:mt-6 md:text-xl"
            >
              {paragraph}
            </p>
          ))
        ) : (
          <p className="label text-bone/55">Biography to follow.</p>
        )}
      </div>

      <figure className="md:col-span-5 md:order-2">
        <div className="aspect-[4/5] w-full overflow-hidden bg-bone/9">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portrait.src}
            srcSet={
              portrait.srcMobile
                ? `${portrait.srcMobile} 1280w, ${portrait.src} 1920w`
                : undefined
            }
            sizes="(min-width: 768px) 40vw, 100vw"
            alt={portrait.alt}
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      </figure>
    </div>
  );
}
