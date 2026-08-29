"use client";

import { useEffect, useRef, useState } from "react";
import { Mark } from "@/components/mark";

/**
 * The footer mark tips itself once, when you reach it.
 *
 * On desktop this moment is available on hover; a thumb has no equivalent, so
 * it fires on arrival instead. The footer is the identity's end card, which
 * makes a hat tip the right gesture there rather than a decorative one.
 *
 * IntersectionObserver rather than `animation-timeline: view()` — this is a
 * one-shot, it needs no scroll-linked progress, and it works on every browser
 * instead of the ~84% that have scroll-driven CSS.
 *
 * The arrival tip lives on the wrapper and the hover/press tilt on the mark
 * itself, deliberately. Both on one element and the animation would win the
 * cascade — `animation-fill-mode: both` holds `rotate` after it finishes, and
 * hover would silently stop working.
 */
export function MarkInView({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect(); // once
        }
      },
      { threshold: 0.6 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mark-tips-in" data-in-view={seen}>
      <Mark
        variant="01"
        fullColour
        className={`origin-[50%_86.25%] transition-[rotate] duration-[var(--duration-mark)] ease-identity motion-safe:hover:-rotate-6 motion-safe:active:-rotate-6 ${className ?? ""}`}
        title={title}
      />
    </div>
  );
}
