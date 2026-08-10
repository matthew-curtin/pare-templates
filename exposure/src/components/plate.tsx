import Image, { type StaticImageData } from "next/image";

/**
 * The only file in this template allowed to import `next/image`.
 *
 * That is what makes "the photographs are a set" a property of the code
 * rather than a promise about everyone's future diligence (§6). The
 * treatment lives in one token, `--photo-filter`, and is applied here;
 * an image added later inherits it whether or not anybody remembers.
 *
 * `scripts/check-imagery.mjs` at the repo root fails the template if a
 * second file imports next/image, so this is enforced rather than
 * merely intended.
 */
export function Plate({
  src,
  alt,
  aspect,
  sizes,
  priority,
  width,
  caption,
  hour,
  className = "",
}: {
  src: StaticImageData;
  alt: string;
  aspect: string;
  sizes: string;
  priority?: boolean;
  /** Tailwind max-width for the figure, so a portrait plate is not
   *  stretched to a landscape column and served at twice its size. */
  width?: string;
  caption?: string;
  /** The hour it was taken, already formatted. The point of the site. */
  hour?: string;
  className?: string;
}) {
  return (
    <figure className={`${width ?? ""} ${className}`}>
      <div className="relative overflow-hidden bg-well" style={{ aspectRatio: aspect }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="plate-img object-cover"
        />
      </div>
      {(caption || hour) && (
        <figcaption className="mt-2.5 flex flex-col gap-1">
          {hour && (
            <span className="datum text-[0.75rem] uppercase text-ink-subtle">
              Taken at {hour}
            </span>
          )}
          {caption && (
            <span className="text-[0.8125rem] leading-relaxed text-ink-muted">
              {caption}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
