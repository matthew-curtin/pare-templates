import { ROAST_INDEX, ROAST_LABEL } from "@/content/coffees";
import type { RoastLevel } from "@/content/types";

const STEPS: RoastLevel[] = ["light", "medium-light", "medium", "medium-dark"];

/**
 * Where this coffee sits on the roast scale, as four segments with one
 * filled. Drawn rather than pictured, so it inherits the accent colour
 * and can be relabelled by editing ROAST_LABEL.
 */
export function RoastScale({ roast }: { roast: RoastLevel }) {
  const activeIndex = ROAST_INDEX[roast];

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="eyebrow text-ink-subtle">Roast</p>
        <p className="text-sm font-semibold">{ROAST_LABEL[roast]}</p>
      </div>

      <div className="mt-3 flex gap-1" role="img"
        aria-label={`Roast level: ${ROAST_LABEL[roast]}, ${activeIndex + 1} of ${STEPS.length}`}>
        {STEPS.map((step, i) => (
          <span
            key={step}
            className={`h-2 flex-1 rounded-full ${
              i <= activeIndex ? "bg-accent" : "bg-line"
            }`}
          />
        ))}
      </div>

      <div className="mt-2 flex justify-between text-xs text-ink-subtle">
        <span>Light</span>
        <span>Dark</span>
      </div>
    </div>
  );
}
