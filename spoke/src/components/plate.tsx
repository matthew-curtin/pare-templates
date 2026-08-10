import type { Shot } from "@/content/types";

/**
 * The only component in this template that renders a photograph.
 *
 * §6: consistency is achieved by ONE treatment applied in ONE place,
 * not by sourcing luck. These four frames were taken in four different
 * workshops under four different lights, and `--photo-filter` is the
 * whole of what makes them a set. `scripts/check-imagery.mjs` fails the
 * template if a second file starts rendering an `<img>`, which is what
 * turns "consistent" into a property of the code rather than a promise
 * about everybody's future diligence.
 *
 * A Vite template has no `next/image`, so the caller imports the asset
 * to get its hashed URL and hands it here — which is why the checker
 * tests for the ELEMENT rather than for an import.
 */
export function Plate({
  shot,
  src,
  className = "",
  aspect = "3 / 2",
  eager = false,
}: {
  shot: Shot;
  src: string;
  className?: string;
  aspect?: string;
  /**
   * Set on every plate that sits in a page's first band, which is all
   * four of them. It is the ordinary LCP advice, and it matters more
   * than usual here: lazy loading is driven by IntersectionObserver,
   * which does not fire in a document rendering with `visibilityState:
   * "hidden"` — and that is exactly how a preview pane renders a
   * template. An above-the-fold photograph that never loads in the one
   * place these are meant to be looked at is not a subtle problem.
   */
  eager?: boolean;
}) {
  return (
    <figure className={`m-0 min-w-0 ${className}`}>
      <div className="overflow-hidden border border-line bg-sunk" style={{ aspectRatio: aspect }}>
        <img
          src={src}
          alt={shot.alt}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          decoding="async"
          className="plate size-full object-cover"
        />
      </div>
      <figcaption className="mt-2 text-[0.8125rem] leading-snug text-ink-subtle">
        {shot.caption}
      </figcaption>
    </figure>
  );
}
