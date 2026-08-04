import type { Flavour } from "@/content/types";

const MAX_SCORE = 5;

/**
 * The four-bar flavour chart on a product page.
 *
 * Drawn in HTML rather than shipped as an image, so it stays sharp,
 * weighs nothing, and every bar can be clicked and edited.
 *
 * The bars run HORIZONTALLY on purpose. A percentage width resolves
 * against the parent's width, which is always known here; a percentage
 * HEIGHT resolves against the parent's height, which inside a flex
 * column is often `auto` — and then the bar silently collapses to
 * nothing. That is a real bug this repo has already shipped once, in
 * the SaaS template, where the chart compiled, typechecked and
 * rendered a blank rectangle.
 */
export function FlavourProfile({ flavour }: { flavour: Flavour[] }) {
  return (
    <div>
      <p className="eyebrow text-ink-subtle">Profile</p>
      <dl className="mt-4 space-y-3">
        {flavour.map((entry) => (
          <div key={entry.label} className="flex items-center gap-4">
            <dt className="w-20 shrink-0 text-sm text-ink-muted">
              {entry.label}
            </dt>
            <dd className="flex flex-1 items-center gap-3">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                <span
                  className="block h-full rounded-full bg-accent"
                  style={{ width: `${(entry.score / MAX_SCORE) * 100}%` }}
                />
              </span>
              <span className="tnum w-8 text-right text-xs text-ink-subtle">
                {entry.score}/{MAX_SCORE}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
