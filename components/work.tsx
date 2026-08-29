import type { SelectedCredit, WorkVideo } from "@/lib/content";

/**
 * Selected credits, written out rather than tabulated — a table of these reads
 * as IMDb, which was the note. Videos lead when there are any; until then the
 * section says so plainly rather than pretending to a reel that doesn't exist.
 */
export function Work({
  credits,
  videos,
}: {
  credits: SelectedCredit[];
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
            {(credit.note || credit.year) && (
              <p className="label mt-2 text-bone/55">
                {[credit.note, credit.year].filter(Boolean).join(" · ")}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
