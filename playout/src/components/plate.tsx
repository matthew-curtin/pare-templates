import type { Shot } from "@/content/types";

/**
 * The only component in this app that renders a photograph.
 *
 * That is the whole mechanism behind §6's consistency rule: one
 * component, one treatment class, so a picture added in a hurry cannot
 * arrive ungraded. `scripts/check-imagery.mjs` at the repo root asserts
 * that no other file imports an image.
 */
export function Plate({
  shot,
  src,
  className = "",
  aspect = "3 / 2",
}: {
  shot: Shot;
  src: string;
  className?: string;
  aspect?: string;
}) {
  return (
    <figure className={className}>
      <div
        className="plate overflow-hidden rounded-console border border-line"
        style={{ aspectRatio: aspect }}
      >
        <img
          src={src}
          alt={shot.alt}
          loading="lazy"
          decoding="async"
          className="plate-img h-full w-full object-cover"
        />
      </div>
      <figcaption className="mt-2 text-[0.75rem] leading-relaxed text-ink-subtle">
        {shot.caption}
      </figcaption>
    </figure>
  );
}
