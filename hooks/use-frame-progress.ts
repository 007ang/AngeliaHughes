"use client";

import { useEffect, useRef } from "react";

/**
 * Fallback driver for the ~16% of browsers without scroll-driven CSS.
 *
 * It writes exactly the same two custom properties the native
 * `animation-timeline: view()` path animates, so there is one visual
 * definition in globals.css and two ways of feeding it — rather than the
 * animation existing twice and the copies drifting apart.
 *
 * It only ever sets a number. It never listens for wheel or touch and never
 * calls preventDefault, so it cannot capture the scroll.
 *
 * Returns a ref to attach to the scroll container. Does nothing at all where
 * the native timeline exists, or under reduced motion.
 */
export function useFrameProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const nativeTimeline =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("animation-timeline", "view()");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (nativeTimeline || reduced) return;

    const frames = Array.from(
      root.querySelectorAll<HTMLElement>("[data-frame]"),
    );
    if (frames.length === 0) return;

    // Only frames near the viewport are measured, so this stays cheap no
    // matter how many photographs there are.
    const live = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            live.add(el);
          } else {
            live.delete(el);
            // Park it at its resting value rather than leaving it mid-reveal.
            const past = entry.boundingClientRect.top < 0;
            el.style.setProperty("--frame-p", "1");
            el.style.setProperty("--frame-out", past ? "1" : "0");
          }
        }
        schedule();
      },
      { rootMargin: "40% 0px" },
    );
    for (const frame of frames) io.observe(frame);

    let raf = 0;
    const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of live) {
        const { top, height } = el.getBoundingClientRect();
        // Mirrors the native ranges: reveal as it enters, recede as it leaves.
        el.style.setProperty(
          "--frame-p",
          clamp01((vh - top) / (vh * 0.75)).toFixed(3),
        );
        el.style.setProperty(
          "--frame-out",
          clamp01(-top / Math.max(height, 1)).toFixed(3),
        );
      }
      if (live.size > 0) schedule();
    };

    const schedule = () => {
      if (raf === 0) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return ref;
}
