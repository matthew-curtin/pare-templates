import type { CSSProperties } from "react";

import { Plate } from "@/components/plate";
import { photos } from "@/content/photos";
import type { Accession } from "@/content/types";
import { inkOn } from "@/lib/ground";
import { tileSpan } from "@/lib/season";

const KIND_WORD: Record<Accession["kind"], string> = {
  flower: "in flower",
  scent: "in scent",
  leaf: "in leaf",
  fruit: "in fruit",
  bark: "bark",
  form: "form",
};

/**
 * One thing on the wall.
 *
 * The size is not a prop anybody chooses — it comes from `tileSpan` of
 * the score, which comes from the plant's own curve. There is no
 * "featured" field anywhere in the content, which is the point: the
 * ranking IS the layout, and the only way to make something big on this
 * site is for it to be worth looking at that week.
 *
 * A tile with a photograph and a tile without are the same component.
 * Three-quarters of the collection has no photograph and renders as a
 * flat field of the plant's own colour with its caption in an ink
 * computed against that colour — which is what makes the wall read as
 * photographs AND colour rather than photographs and holes.
 */
export function Tile({
  accession,
  score,
  priority = false,
  dim = false,
}: {
  accession: Accession;
  score: number;
  priority?: boolean;
  /** Out of season on the collection wall. Still there, still clickable,
   *  visibly not worth crossing the garden for — which is a state the
   *  design has to be able to show, since about two-thirds of the
   *  collection is in it on any given day. */
  dim?: boolean;
}) {
  const span = tileSpan(score);
  const photo = accession.photo
    ? photos.find((p) => p.key === accession.photo)
    : undefined;
  const ink = inkOn(accession.colour);

  const style = {
    "--cols": span,
    "--rows": span,
    "--tile-colour": accession.colour,
    // Named per slug so the browser can match this tile across a
    // navigation and MORPH it — a plant that is bigger next week grows
    // into its new cell instead of the wall cutting to a new state.
    viewTransitionName: `t-${accession.slug}`,
    color: photo ? undefined : ink.css,
    opacity: dim ? 0.42 : undefined,
  } as CSSProperties;

  return (
    <a href={`/plants/${accession.slug}`} className="cell tile" style={style}>
      {photo ? (
        <Plate
          photo={photo.key}
          alt={photo.alt}
          priority={priority}
          sizes={
            span === 3
              ? "(max-width: 48rem) 100vw, 40vw"
              : span === 2
                ? "(max-width: 48rem) 66vw, 26vw"
                : "(max-width: 48rem) 50vw, 14vw"
          }
        />
      ) : null}
      <div className="tile-caption">
        <span className="tile-name display binomial">{accession.name}</span>
        <span className="tile-kind label" style={{ opacity: 0.82 }}>
          {KIND_WORD[accession.kind]}
          {accession.common ? ` · ${accession.common}` : ""}
        </span>
        <span className="tile-note" style={{ opacity: 0.78 }}>
          {accession.note}
        </span>
      </div>
    </a>
  );
}
