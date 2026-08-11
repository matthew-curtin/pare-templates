import type { StaticImageData } from "next/image";
import climb from "@/images/climb.jpg";
import gold from "@/images/gold.jpg";
import green from "@/images/green.jpg";
import fell from "@/images/fell.jpg";
import stand from "@/images/stand.jpg";
import lawn from "@/images/lawn.jpg";

/**
 * The photographic record, kept apart from the binding to bytes above it
 * so that a missing file and a miscaptioned one are two different
 * failures a checker can tell apart.
 *
 * THE DIRECTION: the ground a display is fired from, empty — and the
 * light itself only where the light is the EVIDENCE.
 *
 * That second clause is the whole set. A photograph of a firework on a
 * pyrotechnics website is the single most predictable image in the world
 * and says nothing; three of them here are doing work no sentence can.
 * `climb` shows the entire rising trail below the break, which is what
 * this site is about and what no diagram makes anybody feel. `gold` and
 * `green` sit beside the chemistry because the claim being made is about
 * how bright and what colour these actually are, and a swatch computed
 * from a wavelength is an argument while a photograph is a fact.
 */
export interface Photo {
  id: string;
  src: StaticImageData;
  alt: string;
  caption: string;
  /** What this frame is FOR. If it cannot be answered, it is decoration. */
  job: string;
}

export const PHOTOS: readonly Photo[] = [
  {
    id: "climb",
    src: climb,
    alt: "A long exposure of a single firework: an unbroken trail rising from the bottom of the frame to a violet burst near the top.",
    caption: "One shell, one exposure. The trail is the part nobody writes about.",
    job: "The site's whole argument in one frame — the climb is visible, so the gap between firing and breaking stops being an abstraction.",
  },
  {
    id: "gold",
    src: gold,
    alt: "Two overlapping golden chrysanthemum bursts against a black sky, their trailing stars curving downward.",
    caption: "Charcoal at about 1700 kelvin. Nothing here is a colour; it is a temperature.",
    job: "Beside the chemistry, because the claim is that gold is what almost every display is mostly made of and it needs to be seen next to the expensive alternatives.",
  },
  {
    id: "green",
    src: green,
    alt: "A single green firework burst isolated on black, its stars radiating from a white centre.",
    caption: "Barium at 515 nanometres — with a white core, which every burst has.",
    job: "Proves the point the field's drawing depends on: the middle of a break is near-white whatever the emitter is, which is why a copper blue at 1.2:1 against the night is visible at all.",
  },
  {
    id: "fell",
    src: fell,
    alt: "A drystone wall running over open moorland under a heavy grey sky, rough grass on both sides.",
    caption: "Bracken Fell. Peat over rock, and every stake is a fight.",
    job: "The only site whose GROUND decides anything, and the photograph says why — there is nothing here to bolt a rack to.",
  },
  {
    id: "stand",
    src: stand,
    alt: "A floodlit goalpost and net at night, with an empty concrete terrace behind it.",
    caption: "Carrow Bowl. The far stand is what sends the sound back.",
    job: "The terracing in the background is the thing the site note is about: it returns every break about four-tenths later, and prose alone reads as an excuse.",
  },
  {
    id: "lawn",
    src: lawn,
    alt: "A large mown lawn in front of a white country house framed by two mature trees.",
    caption: "Ravensmoor. Eighty-eight metres from the mortars to that terrace.",
    job: "Shows the distance the whole show is limited by — the firing ground and the audience are both in frame, which is the constraint made visible.",
  },
];

export function photo(id: string): Photo {
  const found = PHOTOS.find((p) => p.id === id);
  if (!found) throw new Error(`unknown photo: ${id}`);
  return found;
}
