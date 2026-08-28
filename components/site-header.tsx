import { Mark } from "@/components/mark";
import type { SiteSettings } from "@/lib/content";

/**
 * Fixed. Her name must be legible in the first frame — the pinned gallery eats
 * most of the scroll length, so nothing important can live below it.
 *
 * The scrim is an identity requirement, not decoration: "never place a mark
 * over a busy mid-tone." It keeps both mark and name readable over photography.
 */
export function SiteHeader({ site }: { site: SiteSettings }) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ground via-ground/80 to-transparent md:h-40"
      />

      <div className="relative flex items-start justify-between gap-6 px-6 py-5 md:px-10 lg:px-16">
        <a
          href="#top"
          className="group pointer-events-auto relative block h-7 text-bone md:h-8"
          aria-label={`${site.name} — home`}
        >
          {/*
            03 at rest, 02 on hover. Both marks share the same 360x120 space
            and an identical brim bar, so the swap pivots on the brim — the
            identity's motion spine — rather than cross-fading two unrelated
            shapes.

            The hat tips as it arrives: origin sits on the brim bar
            (y=103.5 of 120 → 86.25%), so it rotates about the spine rather
            than about its own middle. Eased, not sprung — the identity
            forbids bounce. The tilt is motion-safe only; reduced motion keeps
            the swap and drops the movement.

            Both are permitted over photography, and only these two are,
            which is why the header carries a scrim.
          */}
          <Mark
            variant="03"
            className="h-full w-auto transition-opacity duration-[var(--duration-mark)] ease-identity group-hover:opacity-0 group-focus-visible:opacity-0"
          />
          <Mark
            variant="02"
            className="absolute inset-0 h-full w-auto origin-[50%_86.25%] opacity-0 transition-[opacity,rotate] duration-[var(--duration-mark)] ease-identity group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:group-hover:-rotate-6 motion-safe:group-focus-visible:-rotate-6"
          />
        </a>

        <div className="pointer-events-auto text-right">
          <p className="wordmark text-[11px] leading-none text-bone md:text-[13px]">
            {site.name}
          </p>
          <p className="label mt-2 text-[9px] text-bone/55 md:text-[10px]">
            {site.roleLine}
          </p>
        </div>
      </div>
    </header>
  );
}
