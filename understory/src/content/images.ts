import type { StaticImageData } from "next/image";

import acer from "./photos/acer.jpg";
import arboretum from "./photos/arboretum.jpg";
import bark from "./photos/bark.jpg";
import bluebells from "./photos/bluebells.jpg";
import burnside from "./photos/burnside.jpg";
import camellia from "./photos/camellia.jpg";
import ferns from "./photos/ferns.jpg";
import fuchsia from "./photos/fuchsia.jpg";
import glasshouse from "./photos/glasshouse.jpg";
import gunnera from "./photos/gunnera.jpg";
import hollow from "./photos/hollow.jpg";
import hydrangea from "./photos/hydrangea.jpg";
import magnolia from "./photos/magnolia.jpg";
import mimosa from "./photos/mimosa.jpg";
import shore from "./photos/shore.jpg";
import snowdrops from "./photos/snowdrops.jpg";
import witchhazel from "./photos/witchhazel.jpg";

/**
 * Key → committed file, as static imports so Next knows the intrinsic
 * size and can generate a blur placeholder.
 *
 * Deliberately SEPARATE from `photos.ts`. That file is the editorial
 * record — alt text, the narrative job, the week each frame claims — and
 * this one is the binding to bytes on disk. Keeping them apart is what
 * lets the checker compare the two and catch the pair of failures that
 * actually happen: a photograph that ships with no credit, and a credit
 * for a photograph nobody committed.
 */
export const images: Record<string, StaticImageData> = {
  acer,
  arboretum,
  bark,
  bluebells,
  burnside,
  camellia,
  ferns,
  fuchsia,
  glasshouse,
  gunnera,
  hollow,
  hydrangea,
  magnolia,
  mimosa,
  shore,
  snowdrops,
  witchhazel,
};
