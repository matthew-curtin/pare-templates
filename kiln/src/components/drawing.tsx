import type { Kiln } from "@/content/types";
import type { Layer, Load } from "@/lib/pack";
import { shelfUsed } from "@/lib/pack";

/**
 * The drawings, and the whole design device in three components.
 *
 * Everything here is to scale in real centimetres, and everything here
 * leaves its empty space visible instead of closing it up. That is the
 * argument: a kiln that is 44% full is a picture of a kiln with a lot of
 * air in it, and no arrangement of a bar chart says that as plainly.
 *
 * Drawn in HTML and CSS rather than SVG or an image, per §5 — every
 * shelf, every pot and every hatched gap is an element somebody can
 * click on and edit in Pare.
 */

/** Percent of a whole, as a CSS length. */
function pc(part: number, whole: number): string {
  return `${(part / whole) * 100}%`;
}

/**
 * A kiln seen from the front: shelves, the work standing on them, and
 * the headroom nobody is using.
 *
 * Depth is flattened, so two pots on the same shelf at different depths
 * overlap here the way they would if you opened the door and looked in.
 * The plan view below is where depth is honest.
 */
export function Elevation({
  kiln,
  load,
  label,
}: {
  kiln: Kiln;
  load: Load;
  label?: string;
}) {
  const spare = kiln.height - load.usedHeight;

  return (
    <figure className="m-0">
      <div
        className="relative w-full border border-line-strong bg-sunk"
        style={{ aspectRatio: `${kiln.width} / ${kiln.height}` }}
      >
        {/* Headroom. Drawn, not omitted. */}
        {spare > 0 ? (
          <div
            className="slack absolute inset-x-0"
            style={{ bottom: pc(load.usedHeight, kiln.height), height: pc(spare, kiln.height) }}
          />
        ) : null}

        {load.layers.map((layer, i) => (
          <div key={i}>
            {/* The shelf slab itself. It is 2cm of refractory and it is
                not free — three shelves cost 6cm of the chamber. */}
            <div
              className="absolute inset-x-0 bg-ink-subtle"
              style={{
                bottom: pc(layer.base, kiln.height),
                height: pc(kiln.shelfThickness, kiln.height),
              }}
            />
            {layer.placements.map((p) => (
              <div
                key={p.pieceId}
                className="absolute border border-ink bg-paper"
                style={{
                  bottom: pc(layer.base + kiln.shelfThickness, kiln.height),
                  height: pc(p.height, kiln.height),
                  left: pc(p.x, kiln.width),
                  width: pc(p.width, kiln.width),
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <figcaption className="figure mt-2 text-[0.75rem] text-ink-subtle">
        {label ??
          `${load.layers.length === 1 ? "1 shelf" : `${load.layers.length} shelves`}, ${load.usedHeight}cm of ${kiln.height}`}
      </figcaption>
    </figure>
  );
}

/**
 * One shelf from above.
 *
 * The gaps between the rectangles are the real gaps: a 26cm bowl and a
 * 22cm bowl do not sit side by side on a 40cm shelf, and this is where
 * that stops being an assertion.
 */
export function PlanView({
  kiln,
  layer,
  index,
  labelOf,
}: {
  kiln: Kiln;
  layer: Layer;
  index: number;
  labelOf?: (pieceId: string) => string;
}) {
  const used = shelfUsed(kiln, layer);

  return (
    <figure className="m-0 min-w-0">
      <div
        className="slack relative w-full border border-line-strong bg-sunk"
        style={{ aspectRatio: `${kiln.width} / ${kiln.depth}` }}
      >
        {layer.placements.map((p) => (
          <div
            key={p.pieceId}
            className="absolute flex items-center justify-center overflow-hidden border border-ink bg-paper p-0.5 text-center text-[0.5rem] leading-none text-ink-muted"
            style={{
              left: pc(p.x, kiln.width),
              top: pc(p.y, kiln.depth),
              width: pc(p.width, kiln.width),
              height: pc(p.depth, kiln.depth),
            }}
          >
            {labelOf ? labelOf(p.pieceId) : null}
          </div>
        ))}
      </div>
      <figcaption className="figure mt-2 text-[0.75rem] text-ink-subtle">
        Shelf {index + 1} · {layer.placements.length === 1 ? "1 piece" : `${layer.placements.length} pieces`} ·{" "}
        {Math.round(used * 100)}% of the floor · {layer.height - kiln.shelfThickness - kiln.clearance}cm tall
      </figcaption>
    </figure>
  );
}

/**
 * A single pot's footprint, drawn against the smallest kiln in the
 * studio so that two of these are comparable across the whole site.
 */
export function Footprint({
  width,
  depth,
  against,
}: {
  width: number;
  depth: number;
  against: Kiln;
}) {
  return (
    <div
      aria-hidden
      className="slack relative shrink-0 border border-line-strong bg-sunk"
      style={{ width: "2.75rem", aspectRatio: `${against.width} / ${against.depth}` }}
    >
      <div
        className="absolute left-0 top-0 border border-ink bg-paper"
        style={{
          width: pc(Math.min(width, against.width), against.width),
          height: pc(Math.min(depth, against.depth), against.depth),
        }}
      />
    </div>
  );
}
