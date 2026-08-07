/**
 * Which section of the page is being read.
 *
 * A pure function, in its own file with no imports, for a specific
 * reason: it is the only part of the contents list that can be *wrong*,
 * and everything around it — scroll position, layout, the browser's own
 * event loop — is exactly the sort of thing that cannot be driven in a
 * test. Separating the decision from the machinery that triggers it means
 * the decision can be checked directly, with a list of numbers.
 *
 * The rule: the active heading is the last one whose top has passed the
 * marker line. Not "whichever heading is currently on screen" — with two
 * short sections visible together that picks arbitrarily between them,
 * and with one long section filling the window it picks nothing at all.
 */

export type HeadingPosition = {
  id: string;
  /** Distance from the top of the viewport, as getBoundingClientRect gives it. */
  top: number;
};

/**
 * @param positions Headings in document order.
 * @param marker    Distance from the top of the viewport that counts as
 *                  "reached" — enough to clear the sticky header.
 */
export function pickActiveHeading(
  positions: HeadingPosition[],
  marker: number,
): string | null {
  if (positions.length === 0) return null;

  let active = positions[0].id;
  for (const position of positions) {
    if (position.top <= marker) active = position.id;
    // Headings are in document order, so once one is below the marker
    // every heading after it is too.
    else break;
  }

  // Before the first heading has scrolled past, the first one is still
  // the section you are in — its own prose sits under it.
  return active;
}
