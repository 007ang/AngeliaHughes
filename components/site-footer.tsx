import { Mark } from "@/components/mark";
import type { SiteSettings } from "@/lib/content";

/** Mark, year, done. The short name is the identity's end-card signoff. */
export function SiteFooter({ site }: { site: SiteSettings }) {
  return (
    <footer className="px-6 pb-16 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-5xl">
        <div className="h-px w-full bg-bone/9" />
        <div className="flex items-end justify-between gap-6 pt-8">
          {/* The identity's own end card. 01 is hero use and needs 96px of width —
              at a 3:1 mark space that is 32px tall, so h-9 clears it. This is
              the one place clay appears on the site. */}
          {/* Tips on hover like the header mark, and about the same point: the
              brim bar, which is identical across all three marks and is the
              identity's motion spine. Self-hover rather than group-hover —
              there is no second mark to swap to down here. */}
          <Mark
            variant="01"
            fullColour
            className="h-9 w-auto origin-[50%_86.25%] transition-[rotate] duration-[var(--duration-mark)] ease-identity motion-safe:hover:-rotate-6"
            title={site.name}
          />
          <p className="label text-bone/55">
            {site.shortName} · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
