"use client";

import { useEffect, useRef, useState } from "react";

export type MenuItem = {
  label: string;
  href: string;
  external?: boolean;
};

/**
 * About · Work · Contact · IMDb.
 *
 * Inline links on desktop, a hamburger on mobile. Only two of the four are
 * destinations — Contact is a mailto and IMDb leaves the site — so this stays
 * one page with in-page anchors rather than routes.
 *
 * The email address is never rendered as text, only ever as an href. That was
 * her explicit ask, and it keeps the address away from scrapers.
 */
/** Two bars with rounded caps — the brim, twice. Crosses on open. */
function Bars({ open }: { open: boolean }) {
  const common =
    "absolute left-0 h-[2px] w-full rounded-full bg-current transition-[transform,opacity] duration-[var(--duration-mark)] ease-identity";
  return (
    <span aria-hidden className="relative block h-[10px] w-[26px]">
      <span
        className={common}
        style={{
          top: 0,
          transform: open ? "translateY(4px) rotate(45deg)" : "none",
        }}
      />
      <span
        className={common}
        style={{
          bottom: 0,
          transform: open ? "translateY(-4px) rotate(-45deg)" : "none",
        }}
      />
    </span>
  );
}

/**
 * Items are built on the server and passed in already resolved. Taking the
 * whole settings object instead would serialise it into the RSC payload, and
 * the raw email address would sit in the page source as plain text — which is
 * exactly what hiding it was meant to prevent. Only the mailto: href crosses.
 */
export function SiteMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    // The overlay only exists on mobile, where nothing is pinned — so this
    // cannot disturb ScrollTrigger's measurements the way the splash's lock did.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Lets the header mark answer the menu — see globals.css. A data attribute
    // rather than lifted state, so the header stays a server component.
    document.documentElement.dataset.menuOpen = "";
    panelRef.current?.querySelector("a")?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      delete document.documentElement.dataset.menuOpen;
    };
  }, [open]);

  return (
    <>
      {/* Desktop: the links themselves. */}
      <nav aria-label="Main" className="hidden md:block">
        <ul className="flex items-center gap-8">
          {items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="label text-bone/80 transition-colors duration-200 hover:text-bone focus-visible:text-bone active:text-bone"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile: hamburger. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="site-menu-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className="pointer-events-auto relative z-[70] block text-bone md:hidden"
      >
        <Bars open={open} />
      </button>

      <nav
        id="site-menu-panel"
        ref={panelRef}
        aria-label="Main"
        /* Removes the closed panel from tab order and the a11y tree without
           display:none, so the fade still runs. */
        inert={!open}
        className="fixed inset-0 z-[60] bg-ground transition-opacity duration-[var(--duration-mark)] ease-identity md:hidden"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <ul className="flex h-full flex-col items-start justify-center gap-9 px-8">
          {items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="wordmark text-[18px] text-bone transition-opacity duration-200 hover:opacity-70 active:opacity-60"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
