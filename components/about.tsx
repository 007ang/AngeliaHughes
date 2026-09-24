import type { GalleryImage, SiteSettings } from "@/lib/content";

/**
 * Bio and portrait. This is the site's primary indexable text now that the
 * credit tables are gone, and her own copy happens to carry it well: every
 * title she claims plus Netflix, Paramount, Prime Video and Blumhouse. Worth
 * protecting if the copy is ever rewritten.
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

      {/*
        Travels with the bio rather than ending two paragraphs early.

        `self-start` is load-bearing: a grid item stretches to the row height by
        default, which leaves sticky nothing to travel within and silently does
        nothing. Sticky only — no scroll listener, so it costs nothing and is
        unaffected by reduced motion, which is a layout preference this is not.

        top-24 clears the 72px fixed header (md:py-5 twice + md:h-8) with air.
      */}
      <figure className="md:sticky md:top-24 md:col-span-5 md:order-2 md:self-start">
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
