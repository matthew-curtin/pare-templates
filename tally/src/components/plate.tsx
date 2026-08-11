import Image, { type StaticImageData } from "next/image";

/**
 * THE ONLY COMPONENT IN THIS TEMPLATE THAT RENDERS A PHOTOGRAPH.
 *
 * Nothing else may import `next/image`, and `scripts/check-imagery.mjs` at
 * the repo root enforces it by counting `<img>` elements rather than
 * imports. The reason is §6: consistency across a set sourced from a stock
 * library cannot come from sourcing, only from a treatment applied in one
 * place. `--photo-filter` lives in globals.css as a design token, applied
 * by a single `.plate img` rule, so swapping an image inherits the grade
 * and swapping the grade re-grades every image.
 *
 * The caption is not decoration either. Every photograph on this site is
 * carrying a claim the surrounding prose makes, and the caption says which
 * one — an image you could swap for another of the same subject without
 * anybody noticing is decoration, and decoration is what makes a template
 * look like a template.
 */
export function Plate({
  src,
  alt,
  caption,
  priority = false,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  src: StaticImageData;
  alt: string;
  caption?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <figure className={className}>
      <div className="plate overflow-hidden rounded-md border border-line-soft bg-surface">
        <Image
          src={src}
          alt={alt}
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          className="h-full w-full object-cover"
        />
      </div>
      {caption && (
        <figcaption className="prose-body mt-2 text-micro text-ink-faint">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
