import Image, { type StaticImageData } from "next/image";

/**
 * The only component in this template that renders a photograph.
 *
 * §6: consistency is achieved by ONE treatment applied in ONE place, not
 * by sourcing luck — these four frames were taken in four rooms under
 * four different lights, and `--photo-filter` is what makes them a set.
 * `scripts/check-imagery.mjs` fails the template if a second file starts
 * rendering images, which is what turns "consistent" into a property of
 * the code rather than a promise about everyone's future diligence.
 */
export function Plate({
  shot,
  src,
  className = "",
  aspect = "3 / 2",
  priority = false,
}: {
  shot: { alt: string; caption: string };
  src: StaticImageData;
  className?: string;
  aspect?: string;
  /**
   * Set on every plate that sits in a page's first band, which is all
   * four of them. It is the usual LCP advice, and it matters more than
   * usual here: Next's lazy loading is driven by IntersectionObserver,
   * which does not fire in a document rendering with `visibilityState:
   * "hidden"` — and that is exactly how a preview pane renders a
   * template. An above-the-fold photograph that never loads in the one
   * place these are meant to be looked at is not a subtle problem.
   */
  priority?: boolean;
}) {
  return (
    <figure className={`m-0 ${className}`}>
      <div className="relative overflow-hidden bg-sunk" style={{ aspectRatio: aspect }}>
        <Image
          src={src}
          alt={shot.alt}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          priority={priority}
          className="plate object-cover"
        />
      </div>
      <figcaption className="mt-2 text-[0.8125rem] leading-snug text-ink-subtle">
        {shot.caption}
      </figcaption>
    </figure>
  );
}
