"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(MorphSVGPlugin, ScrollTrigger);

/* Crown states — one element morphs through all three.
   01 literal (creased) → 02 reduced (tapered) → the A of 03.
   "The A is the crown": flatten the apex and a triangle with a crossbar is the
   same drawing as a trapezoid on a bar. */
const CROWN_01 =
  "M108.5,13.2 L142,12.5 L180,15.6 L218,12.5 L251.5,13.2 L277,93 L83,93 Z";
const CROWN_02 = "M109,12 L251,12 L266,58 L94,58 Z";
const CROWN_03_A =
  "M84,93 L92.8,93 L117,12 L108.2,12 Z M172,93 L163.2,93 L139,12 L147.8,12 Z M109,12 L147,12 L147,21 L109,21 Z M93.5,64 L162.5,64 L162.5,73 L93.5,73 Z";

const BAND_01 = "M92.1,64 L267.9,64 L277,93 L83,93 Z";
/** Identical in all three marks. It is the spine; it never morphs. */
const BRIM =
  "M13,99 L347,99 L347.6,107.6 L288,106.4 L232,108.2 L176,106.2 L118,108.1 L62,106.3 L13.6,107.5 Z";
const H_GROUP =
  "M187,12 L196,12 L196,93 L187,93 Z M276.6,93 L267.6,93 L256.4,12 L265.4,12 Z M187,64 L273.2,64 L273.2,73 L187,73 Z";

export function Splash({ name }: { name: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    let done = false;
    let failsafe = 0;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(failsafe);
      el.style.display = "none";
      document.documentElement.style.removeProperty("overflow");
      // The pinned gallery mounted behind a locked scroll, so its pin length
      // was measured against the wrong page height. Re-measure now.
      ScrollTrigger.refresh();
    };

    /**
     * The splash is an opaque overlay that only JavaScript can remove, which
     * makes it a single point of failure for the entire site: if anything
     * below throws, or the timeline never completes, a visitor gets a black
     * page and nothing else. So the escape hatch is armed first, before any
     * animation code runs, and it is unconditional.
     */
    failsafe = window.setTimeout(finish, 6000);

    // Plays on every load, deliberately. Nobody arrives here for reference —
    // if you reloaded it, you reloaded it to watch this. Reduced motion is a
    // stated access need rather than a preference, so it still skips.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    // Hold the scroll only while the splash is up, so the pinned gallery below
    // never measures against a scroll position the visitor did not choose.
    document.documentElement.style.overflow = "hidden";

    let ctx: gsap.Context | undefined;
    try {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ onComplete: finish });

        // Exposure ramps up from black (identity Motion 01).
        tl.fromTo(
          ".splash-stage",
          { opacity: 0 },
          { opacity: 1, duration: 0.22, ease: "none" },
          0,
        )

          // The brim draws outward from centre — the spine arrives first.
          // Driven by a clip rect rather than scaleX: GSAP resolves
          // transformOrigin percentages against the viewBox on SVG children,
          // which left the bar translated off centre.
          .to(
            ".clip-brim",
            { attr: { x: 13, width: 334 }, duration: 0.3, ease: "power2.out" },
            0.06,
          )

          // The crown resolves upward off the brim, as 01 with its clay band.
          .to(
            ".clip-crown",
            { attr: { y: 8, height: 87 }, duration: 0.4, ease: "power3.out" },
            0.3,
          )
          .fromTo(
            ".splash-band",
            { opacity: 0 },
            { opacity: 1, duration: 0.24 },
            0.42,
          )

          // Detail strips away: 01 → 02. The band opens into a slot.
          .to(
            ".splash-crown",
            { morphSVG: CROWN_02, duration: 0.42, ease: "power2.inOut" },
            0.86,
          )
          .to(".splash-band", { opacity: 0, duration: 0.28 }, 0.86)

          // The hat is wiped by the brim; the monogram grows back out of it.
          // "The A is the crown" — same geometry, same spine, next state.
          .to(
            ".clip-crown",
            { attr: { y: 95, height: 0 }, duration: 0.32, ease: "power2.in" },
            1.3,
          )
          .to(
            ".clip-mono",
            { attr: { y: 8, height: 87 }, duration: 0.38, ease: "power3.out" },
            1.5,
          )

          // Rack focus: hunts past sharp, then settles (identity Motion 01).
          .fromTo(
            ".splash-stage",
            { filter: "blur(11px)" },
            { filter: "blur(0px)", duration: 0.9, ease: "power2.out" },
            0.3,
          )

          // Letters resolve — 220ms, identity Motion 03.
          .fromTo(
            ".splash-word",
            { opacity: 0 },
            { opacity: 1, duration: 0.22 },
            1.78,
          )

          // Wiped by the brim line: the ground parts along the spine while the
          // lockup holds, so the mark is still standing there as the gallery
          // opens behind it. The scrim travels with it — the identity allows
          // 02/03 over photography only with one — and both dissolve last.
          .to(
            ".splash-panel-top",
            { yPercent: -100, duration: 0.6, ease: "power3.inOut" },
            2.3,
          )
          .to(
            ".splash-panel-bottom",
            { yPercent: 100, duration: 0.6, ease: "power3.inOut" },
            2.3,
          )
          .to(
            [".splash-stage", ".splash-scrim"],
            { opacity: 0, duration: 0.42, ease: "power2.in" },
            2.74,
          );

        // Any intent to interact ends it immediately.
        const skip = () => {
          tl.progress(1);
          tl.kill();
          finish();
        };
        for (const evt of [
          "pointerdown",
          "keydown",
          "wheel",
          "touchstart",
        ] as const) {
          window.addEventListener(evt, skip, { once: true, passive: true });
        }
      }, el);
    } catch (error) {
      // Never let a broken animation cost the visitor the whole page.
      console.error("[splash] animation failed, revealing page:", error);
      finish();
    }

    return () => {
      window.clearTimeout(failsafe);
      ctx?.revert();
      document.documentElement.style.removeProperty("overflow");
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      role="presentation"
      className="splash-root fixed inset-0 z-[100]"
    >
      {/* Two ground panels, parting along the brim line on exit. */}
      <div className="splash-panel-top absolute inset-x-0 top-0 h-1/2 bg-ground" />
      <div className="splash-panel-bottom absolute inset-x-0 bottom-0 h-1/2 bg-ground" />

      {/* Keeps the mark legible once the panels open onto the photograph. */}
      <div
        className="splash-scrim pointer-events-none absolute"
        style={{
          /* Extends past the viewport so the blur below has no hard edge to
             reveal at the screen boundary. */
          inset: "-14%",
          /* Never fully opaque, and falling off over a long way — the mark
             should sit on the photograph rather than punch a hole in it.
             color-mix keeps the ground token as the single source of truth
             instead of hardcoding a second warm black. */
          background: `radial-gradient(ellipse 52% 46% at 50% 50%,
            color-mix(in srgb, var(--color-ground) 76%, transparent) 0%,
            color-mix(in srgb, var(--color-ground) 64%, transparent) 38%,
            color-mix(in srgb, var(--color-ground) 34%, transparent) 60%,
            color-mix(in srgb, var(--color-ground) 12%, transparent) 74%,
            transparent 88%)`,
          /* Softens the ends of the vignette so it dissolves into the frame
             instead of ending on a visible ring, and kills gradient banding
             across a large area of near-black. */
          filter: "blur(32px)",
        }}
      />

      <div className="splash-stage absolute inset-0 flex flex-col items-center justify-center gap-8 px-6">
        <svg
          viewBox="0 0 360 120"
          className="w-[min(48vw,340px)]"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={6}
          strokeLinejoin="round"
        >
          <defs>
            {/* Every reveal is a rect opening from the brim line — the spine.
                No transforms, so nothing can drift off centre. */}
            <clipPath id="ah-clip-brim">
              <rect
                className="clip-brim"
                x={180}
                y={94}
                width={0}
                height={22}
              />
            </clipPath>
            <clipPath id="ah-clip-crown">
              <rect
                className="clip-crown"
                x={0}
                y={95}
                width={360}
                height={0}
              />
            </clipPath>
            <clipPath id="ah-clip-mono">
              <rect className="clip-mono" x={0} y={95} width={360} height={0} />
            </clipPath>
          </defs>

          <g clipPath="url(#ah-clip-crown)">
            <path className="splash-crown text-bone" d={CROWN_01} />
            <path
              className="splash-band"
              d={BAND_01}
              fill="#9F4B33"
              stroke="#9F4B33"
            />
          </g>
          <g className="text-bone" clipPath="url(#ah-clip-mono)">
            <path d={`${CROWN_03_A} ${H_GROUP}`} />
          </g>
          <g className="text-bone" clipPath="url(#ah-clip-brim)">
            <path d={BRIM} />
          </g>
        </svg>

        <p className="splash-word wordmark text-center text-[11px] text-bone md:text-[13px]">
          {name}
        </p>
      </div>
    </div>
  );
}
