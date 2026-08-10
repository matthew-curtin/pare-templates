import Image, { type StaticImageData } from "next/image";

/**
 * Every photograph on the site goes through this one component.
 *
 * That is the mechanism behind the consistency, not a coincidence of
 * sourcing — CONVENTIONS §6. The treatment lives in `.plate` in
 * globals.css, so a new image inherits it by being rendered here, and
 * there is no second place where a photograph could appear untreated.
 * If you find yourself writing a bare `<Image>` in a page, that is the
 * bug, and `scripts/check-imagery.mjs` at the repo root fails the run
 * when a second file imports `next/image`.
 *
 * The images are static imports rather than paths under `public/`, so
 * Next knows their dimensions at build time and reserves the space. A
 * photograph that arrives late and pushes the page down is the most
 * common way imagery makes a site feel worse than no imagery at all.
 */
export function Plate({
  src,
  alt,
  caption,
  aspect,
  priority = false,
  sizes = "100vw",
  className = "",
}: {
  src: StaticImageData;
  /**
   * Written against the picture, never before sourcing it — §6.
   * Describe what is in the frame, not what you hoped to find there.
   */
  alt: string;
  /** Shown on the image. Optional: not every photograph is making a
   *  point that needs words. */
  caption?: string;
  /** A CSS aspect-ratio, e.g. "16 / 7". Omit to use the file's own. */
  aspect?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const body = (
    <Image src={src} alt={alt} placeholder="blur" priority={priority} sizes={sizes} />
  );

  if (!caption) {
    return (
      <div className={`plate ${className}`} style={{ aspectRatio: aspect }}>
        {body}
      </div>
    );
  }

  return (
    <figure className={`plate ${className}`} style={{ aspectRatio: aspect }}>
      {body}
      <figcaption className="text-[0.8125rem] leading-snug">{caption}</figcaption>
    </figure>
  );
}
