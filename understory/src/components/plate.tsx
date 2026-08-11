import Image from "next/image";
import type { StaticImageData } from "next/image";

import { images } from "@/content/images";

/**
 * The ONE component in this template that renders an image.
 *
 * CONVENTIONS §6: consistency comes from a treatment, not from sourcing
 * luck, and routing every photograph through a single component is what
 * makes that a property of the code instead of a promise about everyone
 * remembering. `--photo-filter` is declared once in `globals.css` and
 * applied once, here. Nothing else may import `next/image`, and
 * `scripts/check-imagery.mjs` fails the run if anything does.
 *
 * The filter is deliberately light — see the long note beside the token.
 * A garden's colour is the evidence this site is arguing from, so the
 * grade pulls sixteen stock frames toward each other rather than
 * flattening them into a set.
 */
export function Plate({
  photo,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  photo: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const src: StaticImageData | undefined = images[photo];
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      className={`tile-photo ${className}`}
    />
  );
}
