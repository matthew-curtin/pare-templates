import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * The rendered width of an element, in real pixels.
 *
 * Charts here draw at their true size rather than scaling a fixed
 * viewBox. Scaling a viewBox is less code, but it scales *everything*:
 * a 2px line becomes 3.4px on a wide screen, and axis labels grow and
 * shrink with the container. Measuring and drawing at real pixels
 * keeps every spec in the mark table meaning what it says.
 *
 * **The first measurement is synchronous, and that is load-bearing.**
 * An earlier version relied on ResizeObserver's initial notification
 * to deliver the starting width. That notification is tied to the
 * browser's rendering steps, so anywhere the page is not actively
 * painting — a background tab, a hidden panel, an embedded preview —
 * it can be delayed indefinitely, and a chart that renders nothing
 * until it arrives stays permanently blank. It was caught by toggling
 * a chart to its table view and back: the chart never returned.
 *
 * Reading the box in a layout effect gets the width before the first
 * paint and never depends on the observer arriving at all. The
 * observer is then only what it should be — the thing that notices
 * *subsequent* resizes.
 */
export function useMeasuredWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    setWidth(element.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}
