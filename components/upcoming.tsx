import type { Upcoming as UpcomingItem } from "@/lib/content";

/**
 * Four titles, all 2026, all in post — and she has stepped up to 'a' camera
 * on three of four. Statuses are shown verbatim: "Post-production" reads as
 * working right now, which is the correct signal during festival week.
 */
export function Upcoming({ items }: { items: UpcomingItem[] }) {
  return (
    <ul className="mt-12 md:mt-16">
      {items.map((item) => (
        <li
          key={item.title}
          className="grid grid-cols-1 gap-2 border-t border-bone/9 py-6 first:border-t-0 md:grid-cols-12 md:items-baseline md:gap-6"
        >
          <h3 className="text-lg leading-tight text-bone md:col-span-3 md:text-xl">
            {item.title}
          </h3>

          <p className="label text-bone/55 md:col-span-3">
            {[item.format, item.episodes].filter(Boolean).join(" · ")}
          </p>

          <p className="label text-bone/55 tracking-[0.12em] md:col-span-4">
            {item.roles}
          </p>

          <p className="label text-bone md:col-span-2 md:text-right">
            {item.status}
          </p>
        </li>
      ))}
    </ul>
  );
}
