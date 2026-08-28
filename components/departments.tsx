import { CountUp } from "@/components/count-up";
import type { Department } from "@/lib/content";

/**
 * The page's centrepiece and its whole argument.
 *
 * Eight rows at ONE size. The 40 is credibility — nobody argues with forty
 * camera credits. The seven singles are the case for directing: she has
 * written, cut, produced, done visual effects and acted. Stated as plain
 * numbers that is more persuasive than any sentence claiming it, and she
 * never has to overclaim a title.
 *
 * Do not make the 40 large. A giant 40 makes her an operator; eight equal
 * rows make her someone who has worked everywhere.
 */
export function Departments({ departments }: { departments: Department[] }) {
  return (
    <ul className="mt-12 md:mt-16">
      {departments.map((d) => (
        <li
          key={d.label}
          className="flex items-baseline justify-between gap-8 border-t border-bone/9 py-5 first:border-t-0 md:py-6"
        >
          <span className="text-lg leading-tight text-bone md:text-xl">
            {d.label}
          </span>
          <span className="text-lg leading-tight text-bone md:text-xl">
            <CountUp value={d.count} />
          </span>
        </li>
      ))}
    </ul>
  );
}
