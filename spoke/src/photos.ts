/**
 * The four photographs, imported once so the URLs are hashed by Vite
 * and the files are committed rather than hotlinked (§6).
 *
 * Nothing else in `src/` imports one of these directly — they are
 * handed to `components/plate.tsx`, which is the only component that
 * renders an `<img>` and the only place the treatment is applied.
 */
import wheel from "./photos/wheel.jpg";
import bins from "./photos/bins.jpg";
import shop from "./photos/shop.jpg";
import rack from "./photos/rack.jpg";

export const photos = { wheel, bins, shop, rack };
