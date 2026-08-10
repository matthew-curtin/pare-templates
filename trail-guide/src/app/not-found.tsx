import Link from "next/link";
import { Shell } from "@/components/shell";

export default function NotFound() {
  return (
    <Shell rail="plain" railLabel="Elevation profile of the whole traverse.">
      <div className="px-4 py-20 sm:px-8">
        <p className="datum text-[0.75rem] uppercase text-ink-subtle">404</p>
        <h1 className="head mt-3 text-display">Off the route</h1>
        <p className="prose-block mt-4 text-lede leading-relaxed text-ink-muted">
          There is no page here. The rail on the left is still the whole
          traverse, which is more than can be said for most wrong turns
          on it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/stages"
            className="focus-ring bg-water px-5 py-2.5 text-[0.9375rem] font-semibold text-on-water transition-opacity hover:opacity-85"
          >
            Back to the stages
          </Link>
          <Link
            href="/"
            className="focus-ring border border-line-strong px-5 py-2.5 text-[0.9375rem] font-semibold transition-colors hover:border-ink"
          >
            The route
          </Link>
        </div>
      </div>
    </Shell>
  );
}
