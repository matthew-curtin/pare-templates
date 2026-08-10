import Link from "next/link";
import { Shell, Band } from "@/components/shell";
import { Dial } from "@/components/dial";
import { dayFacts } from "@/lib/view";

export default function NotFound() {
  const dec = dayFacts("dec");
  const pane = (
    <div>
      <div className="mx-auto w-36">
        <Dial arc={dec.arc} label="still there" />
      </div>
    </div>
  );
  return (
    <Shell pane={pane}>
      <Band last>
        <h1 className="head head-display max-w-[14ch] text-display">
          Nothing at this address
        </h1>
        <p className="prose-block mt-5 text-lede leading-relaxed text-ink-muted">
          The page has gone, which is more than can be said for the sun —
          it is exactly where it always is on this day of the year.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/homes"
            className="focus-ring bg-ink px-5 py-2.5 text-[0.9375rem] text-canvas transition-opacity hover:opacity-85"
          >
            The six homes
          </Link>
          <Link
            href="/"
            className="focus-ring border border-line-strong px-5 py-2.5 text-[0.9375rem] transition-colors hover:border-ink"
          >
            Front page
          </Link>
        </div>
      </Band>
    </Shell>
  );
}
