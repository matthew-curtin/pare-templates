import { flushSync } from "react-dom";

type ViewTransition = {
  ready: Promise<void>;
  finished: Promise<void>;
};

type WithTransition = Document & {
  startViewTransition?: (callback: () => void) => ViewTransition;
};

/**
 * Swallow the rejection an aborted transition throws.
 *
 * Starting a transition while one is already running aborts the first,
 * and BOTH its `ready` and `finished` promises reject. Nobody is
 * awaiting them, so they surface as uncaught rejections — twice per
 * collision. It is not a bug in the feature: aborting is correct when
 * somebody clicks two filters in quick succession, and the second
 * transition runs fine. But a console with red in it is a console people
 * stop reading, and this is only visible if you actually DRIVE the
 * interaction rather than look at a screenshot of it (§8).
 */
function ignoreAbort(transition: ViewTransition): void {
  const swallow = () => {};
  transition.ready.catch(swallow);
  transition.finished.catch(swallow);
}

/**
 * Run a state change as a view transition.
 *
 * `flushSync` is not optional. The browser snapshots the DOM when the
 * callback RETURNS, so a plain `setState` inside it schedules a render
 * for after the snapshot and the transition captures the old state
 * twice — which looks exactly like the feature not working.
 *
 * Reduced motion skips the transition rather than shortening it, so it
 * degrades to the final state rather than to a fast version of the
 * animation (§4c).
 */
export function withViewTransition(update: () => void): void {
  const doc = document as WithTransition;
  const reduced =
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof doc.startViewTransition !== "function" || reduced) {
    update();
    return;
  }

  ignoreAbort(
    doc.startViewTransition(() => {
      flushSync(update);
    }),
  );
}
