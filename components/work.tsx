import type { Poster, SelectedCredit, WorkVideo } from "@/lib/content";

/**
 * Selected credits, written out rather than tabulated — a table of these reads
 * as IMDb, which was the note. Videos lead when there are any; until then the
 * credits stand alone rather than pretending to a reel that doesn't exist.
 *
 * The list is headed "Camera" because that is how she scoped it. The site
 * pitches her as a filmmaker building a directing reel, so letting these read
 * as her directing work would misrepresent them.
 */
export function Work({
  credits,
  posters,
  videos,
}: {
  credits: SelectedCredit[];
  posters: Poster[];
  videos: WorkVideo[];
}) {
  return (
    <div className="mt-12 md:mt-16">
      {videos.length > 0 && (
        <ul className="mb-16 grid gap-8 md:grid-cols-2">
          {videos.map((video) => (
            <li key={video.url}>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <span className="block text-lg leading-tight text-bone transition-opacity duration-200 group-hover:opacity-70 group-active:opacity-70 md:text-xl">
                  {video.title}
                </span>
                <span className="label mt-2 block text-bone/55">
                  {[video.year, video.provider].filter(Boolean).join(" · ")}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <h3 className="label mb-6 text-bone/55">Camera</h3>

      <ul>
        {credits.map((credit) => (
          <li
            key={credit.title}
            className="border-t border-bone/9 py-6 first:border-t-0"
          >
            <p className="text-lg leading-snug text-bone md:text-xl">
              <span>{credit.title}</span>
              <span className="text-bone/55"> — {credit.role}</span>
            </p>
            <p className="label mt-2 text-bone/55">
              {[credit.format, credit.studio, credit.episodes, credit.year]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </li>
        ))}
      </ul>

      {posters.length > 0 && (
        <>
          <h3 className="label mt-16 mb-6 text-bone/55">Posters</h3>

          {/*
            A shelf rather than a grid. Five portrait posters do not divide
            cleanly into two or three columns, and a grid leaves an orphan on
            the last row at most widths. Horizontal scroll holds any count and
            reads like posters on a wall.

            overflow-x here is a descendant scroll container, not an ancestor
            of the pinned gallery, so it cannot interfere with the pin.

            scroll-pl-6 matches the page gutter the -mx-6/px-6 bleed restores.
            Without it the snapport starts at the padding box, so mandatory
            snapping parks the first poster flush against the screen edge,
            24px out of line with the heading and every other element.

            40vw rather than a width that divides the screen evenly: two
            posters plus a sliver of the third, so the row visibly continues
            past the frame. A shelf that ends flush at the edge reads as a
            complete set and nobody swipes it.
          */}
          <ul className="-mx-6 flex snap-x snap-mandatory scroll-pl-6 gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:scroll-pl-0 md:gap-6 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {posters.map((poster) => (
              <li
                key={poster._id ?? poster.title}
                className="w-[40vw] shrink-0 snap-start sm:w-[28vw] md:w-auto md:flex-1"
              >
                <div className="aspect-[2/3] w-full overflow-hidden bg-bone/9">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={poster.src}
                    alt={poster.alt}
                    width={800}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="label mt-3 text-bone/55">{poster.title}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
