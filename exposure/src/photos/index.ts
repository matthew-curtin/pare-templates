import gardenRoom from "./garden-room.jpg";
import januarySun from "./january-sun.jpg";
import southSide from "./south-side.jpg";
import theRidge from "./the-ridge.jpg";
import oneWall from "./one-wall.jpg";

/**
 * Static imports, so Next knows each file's real dimensions at build
 * time and every plate can declare its own aspect ratio instead of
 * being cropped to a house style.
 *
 * Deliberately NOT annotated with `StaticImageData`: the repo's imagery
 * checker counts files that import from `next/image`, and requires
 * exactly one. A type-only import satisfies that regex just as well as a
 * value one, so annotating here would fail the run for a reason nobody
 * would find quickly. The types are inferred from the imports anyway.
 */
const files = {
  "garden-room.jpg": gardenRoom,
  "january-sun.jpg": januarySun,
  "south-side.jpg": southSide,
  "the-ridge.jpg": theRidge,
  "one-wall.jpg": oneWall,
};

/** Widened to a string index so a `Shot.file` can look one up. The value
 *  type is taken from the map itself rather than named, for the same
 *  reason the imports are unannotated — naming it means importing it
 *  from `next/image`, and the imagery checker counts those. */
export const photos: Record<string, (typeof files)[keyof typeof files]> = files;
