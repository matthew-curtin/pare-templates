import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { Planner } from "@/components/planner";
import { legs } from "@/content/route";
import { model } from "@/content/site";
import { hoursOf, longestDayByLength } from "@/lib/route";
import { hoursLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "Plan",
  description:
    "Split the Sable Traverse into six to eleven days and see what each one actually costs.",
};

const worst = [...legs].sort((a, b) => hoursOf(b, model) - hoursOf(a, model))[0];
const floor = longestDayByLength(legs, model);

export default function PlanPage() {
  return (
    <Shell
      rail="scroll"
      railLabel="Elevation profile of the whole traverse, in the order the days run."
    >
      <div className="px-4 py-12 sm:px-8">
        <h1 className="head text-display">Build an itinerary</h1>
        <p className="prose-block mt-4 text-lede leading-relaxed text-ink-muted">
          A day can only end where there is a roof or a platform, so the
          route splits at the ten places between the two trailheads and
          nowhere else. This picks the split that makes the longest day
          as short as it can be, which is the number that decides
          whether the plan works.
        </p>
        <p className="prose-block mt-4 text-[0.9375rem] leading-relaxed text-ink-subtle">
          Adding a day can never make the longest day longer, and it
          stops helping entirely at {hoursLabel(floor[floor.length - 1])} —{" "}
          {worst.name} is one leg, and it cannot be broken.
        </p>

        <div className="mt-12">
          <Planner />
        </div>
      </div>
    </Shell>
  );
}
