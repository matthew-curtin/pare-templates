import Image, { type StaticImageData } from "next/image";

/**
 * The ONLY component in this template that renders an image.
 *
 * CONVENTIONS §6: consistency across a photographic set has to be a
 * property of the code rather than a promise about everyone's future
 * diligence, so the treatment is declared once in `globals.css` as
 * `--photo-filter` and applied once, here. A photograph swapped in
 * later inherits the grade without anybody remembering to apply it.
 */
export function Plate({
  src,
  alt,
  caption,
  credit,
  priority = false,
  className = "",
  sizes = "(min-width: 64rem) 50vw, 100vw",
}: {
  src: StaticImageData;
  alt: string;
  caption?: string;
  credit?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <figure className={`plate ${className}`}>
      <div className="relative overflow-hidden bg-[var(--stock-field)]">
        <Image
          src={src}
          alt={alt}
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          className="h-full w-full object-cover"
        />
      </div>
      {(caption || credit) && (
        <figcaption className="prose-body mt-2 text-sm opacity-70">
          {caption}
          {credit && <span className="ml-2 opacity-60">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
