"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Identity Motion 03 — MINIMAL:
 *   "RULE DRAWS ACROSS, 260MS / LETTERS RESOLVE, 220MS"
 *
 * One rule per section, not per element. This is the site's third and last
 * motion moment; everything inside it holds still so the gallery lands.
 */
export function Section({
  id,
  label,
  children,
  className = "",
}: {
  id?: string;
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion is handled in CSS (see globals.css) rather than here, so
    // the reveal never depends on a synchronous state write during layout.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect(); // once
        }
      },
      { threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`px-6 md:px-10 lg:px-16 ${className}`}
      style={{ paddingTop: "var(--section-pad)", paddingBottom: "var(--section-pad)" }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <div
          aria-hidden
          data-reveal
          className="h-px w-full origin-left bg-bone/9"
          style={{
            transform: `scaleX(${shown ? 1 : 0})`,
            transition: "transform var(--duration-rule) var(--ease-identity)",
          }}
        />

        <div
          data-reveal
          style={{
            opacity: shown ? 1 : 0,
            transition: `opacity var(--duration-resolve) var(--ease-identity) ${
              shown ? "var(--duration-rule)" : "0ms"
            }`,
          }}
        >
          {label && (
            <h2 className="label mt-8 text-bone/55">{label}</h2>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
