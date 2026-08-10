import type { Shot } from "./types.ts";

/**
 * THE DIRECTION (§6):
 *
 *   Parts before they are a bicycle — close, on a bench or in a stand,
 *   no faces, and enough depth of field to COUNT things.
 *
 * The last clause is the one that did the work. This site is entirely
 * about counting — sixty-four spokes, eight hundred and twelve nipples,
 * five parts that cost seventy cents between them — so a photograph too
 * shallow to count anything in is decoration however handsome it is.
 * It rejected two otherwise excellent frames: a beautifully lit hub at
 * f/1.4 with three spokes in focus, and a close-up of a rear triangle
 * whose only readable content was a manufacturer's decal.
 *
 * Every caption below was written AFTER looking at the file, which is
 * the other half of §6 and is not a formality: the shot originally
 * planned for the front page was a brazing torch, and no honest
 * candidate existed — everything returned for brazing was arc welding,
 * which is not what happens to a bicycle frame. The subject changed
 * rather than the caption being fudged.
 *
 * One frame was CROPPED rather than rejected. The hanging framesets
 * carried a real shop's tag and a real price ticket in the top quarter
 * — §6 forbids shipping another company's name — and the centre band is
 * both clean and a better composition.
 */
export const shots: Record<"wheel" | "bins" | "shop" | "rack", Shot> = {
  wheel: {
    job: "Make sixty-four spokes a real number rather than a claim on a page. The board says a bicycle is a tree of about a hundred parts; this is what one line of that tree looks like when you can count it.",
    alt: "A bicycle front wheel photographed from the side in low sun, its spokes crossing in a clear pattern between the hub flange and the rim, with the fork blade running down the right of the frame.",
    caption:
      "One front wheel: a rim, a hub, thirty-two spokes and thirty-two nipples. Two of these per bicycle, which is where the sixty-four comes from.",
  },
  bins: {
    job: "Show the parts that actually stop a build. The front page claims the five things nearest to halting a Kade cost seventy cents between them, and the claim is easier to believe standing in front of the drawer.",
    alt: "Open steel bins on a workshop shelf, each holding one kind of fastener — plated bolts, flat washers, nyloc nuts — with two bins of yellow and red crimp spade terminals among them.",
    caption:
      "Bolts, washers, nuts, and two bins of spade terminals. Three of the five parts closest to stopping a Kade this week are somewhere in this picture.",
  },
  shop: {
    job: "Show that a bill of materials is a room. Frames hung in batches, small parts in bins, half-built bicycles on stands — the same hierarchy as the tree page, laid out in floor space instead of indentation.",
    alt: "An assembly workshop seen from above: rows of bare frames hanging from the ceiling, a wall of small-parts bins, several part-built bicycles clamped in floor stands, and one person working with their back to the camera.",
    caption:
      "The tree, laid out as floor space. Framesets overhead, bought parts in bins on the wall, and whatever is being assembled that morning in the middle.",
  },
  rack: {
    job: "Explain a five-week lead time in one image. A frameset is not a thing you order on Tuesday — it is hanging up months before anybody wants it, hand-labelled, waiting to become a bicycle.",
    alt: "Bare bicycle frames and forks hanging from a rack in a workshop, two of them labelled with handwritten paper tags reading 57cm, with cut tube ends visible in the foreground.",
    caption:
      "Framesets waiting, tagged by hand. Five weeks from a mill run to this rack, which is why the tube sets are ordered against a guess.",
  },
};
