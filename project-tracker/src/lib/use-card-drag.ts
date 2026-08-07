import { useCallback, useEffect, useRef, useState } from "react";
import { moveIssue } from "./board-store";
import type { ColumnId } from "@/content/types";

/**
 * Dragging a card between columns.
 *
 * Built on pointer events rather than HTML5 drag-and-drop, deliberately.
 * Native DnD gives you an unstyleable drag image, no useful control over
 * the drop position within a list, and nothing at all on touch. It also
 * routes through `dataTransfer`, which anything else on the page that
 * intercepts file drops can interfere with.
 *
 * Three things here are less obvious than they look:
 *
 * 1. **The pointer is captured, and the listeners go on the captured
 *    element** — not on `window`. Captured pointer events fire on the
 *    element that holds the capture, so a window listener can miss them.
 * 2. **A `buttons & 1` check at the top of every move.** If a release is
 *    ever lost, the next move arrives with no button held; without this
 *    the card follows the cursor forever with nothing pressed.
 * 3. **Touch needs a long press.** A card that grabs the pointer
 *    immediately makes the column impossible to scroll with a finger.
 *    `touch-action: pan-y` lets the browser scroll, and the drag only
 *    arms after the press has been held still.
 */

const DRAG_THRESHOLD_PX = 4;
const TOUCH_HOLD_MS = 350;

export interface DropTarget {
  column: ColumnId;
  index: number;
}

export interface DragState {
  issueId: string;
  width: number;
  height: number;
  target: DropTarget | null;
}

interface Pending {
  issueId: string;
  pointerId: number;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  element: HTMLElement;
  /** Touch must wait out the hold before it may begin. */
  armed: boolean;
  /** The drag is visibly under way. */
  started: boolean;
  target: DropTarget | null;
  holdTimer: number | null;
  detach: () => void;
}

function sameTarget(a: DropTarget | null, b: DropTarget | null): boolean {
  if (a === null || b === null) return a === b;
  return a.column === b.column && a.index === b.index;
}

/**
 * Which column, and where in it, the pointer is over.
 *
 * Hit-tested against the live DOM on every move rather than against
 * rectangles measured once at the start, because inserting the drop
 * slot moves every card below it. Measured rects would be a frame stale
 * from the first crossing onwards.
 */
function hitTest(x: number, y: number): DropTarget | null {
  const under = document.elementFromPoint(x, y);
  const columnEl = under?.closest<HTMLElement>("[data-column-id]");
  if (!columnEl) return null;

  const column = columnEl.dataset.columnId as ColumnId;
  // The dragged card is not rendered, so these indexes are already in
  // the same space `moveIssue` inserts into.
  const cards = Array.from(
    columnEl.querySelectorAll<HTMLElement>("[data-card-id]"),
  );

  for (let index = 0; index < cards.length; index += 1) {
    const rect = cards[index].getBoundingClientRect();
    if (y < rect.top + rect.height / 2) return { column, index };
  }
  return { column, index: cards.length };
}

function positionGhost(x: number, y: number): void {
  const root = document.documentElement;
  root.style.setProperty("--drag-x", `${x}px`);
  root.style.setProperty("--drag-y", `${y}px`);
}

export function useCardDrag() {
  const [drag, setDrag] = useState<DragState | null>(null);
  const pendingRef = useRef<Pending | null>(null);
  /** Set when a drag ends, so the click that follows does not open the card. */
  const suppressClickRef = useRef(false);

  const teardown = useCallback(
    (commit: boolean, releaseAt?: { x: number; y: number }) => {
      const pending = pendingRef.current;
      pendingRef.current = null;
      if (!pending) return;

      if (pending.holdTimer !== null) window.clearTimeout(pending.holdTimer);
      pending.detach();

      if (pending.started) {
        suppressClickRef.current = true;
        // Where the pointer was RELEASED is the intent — not where the
        // last move event happened to land. A quick flick outruns the
        // move stream, and committing the stored target drops the card a
        // column behind the cursor. Fall back to the stored target only
        // when the release was outside every column.
        const target = releaseAt
          ? (hitTest(releaseAt.x, releaseAt.y) ?? pending.target)
          : pending.target;
        if (commit && target) {
          moveIssue(pending.issueId, target.column, target.index);
        }
      }

      document.body.classList.remove("select-none");
      setDrag(null);
    },
    [],
  );

  const startDrag = useCallback(
    (event: React.PointerEvent<HTMLElement>, issueId: string) => {
      if (event.button !== 0) return;
      // A second pointer arriving mid-drag would corrupt the first.
      if (pendingRef.current) return;

      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      const isTouch = event.pointerType === "touch";

      const begin = () => {
        const pending = pendingRef.current;
        if (!pending || pending.started) return;
        pending.started = true;
        document.body.classList.add("select-none");
        positionGhost(rect.left, rect.top);
        setDrag({
          issueId,
          width: pending.width,
          height: pending.height,
          target: null,
        });
      };

      const onMove = (moveEvent: PointerEvent) => {
        const pending = pendingRef.current;
        if (!pending || moveEvent.pointerId !== pending.pointerId) return;

        // A release we never saw. Recover rather than track a dead drag.
        if (!(moveEvent.buttons & 1)) {
          teardown(true);
          return;
        }

        const dx = moveEvent.clientX - pending.startX;
        const dy = moveEvent.clientY - pending.startY;
        const travelled = Math.hypot(dx, dy);

        if (!pending.started) {
          // Touch: moving before the hold completes is a scroll, not a
          // drag. Stand down and let the browser have it.
          if (!pending.armed) {
            if (travelled > DRAG_THRESHOLD_PX) teardown(false);
            return;
          }
          if (travelled < DRAG_THRESHOLD_PX) return;
          begin();
        }

        positionGhost(
          moveEvent.clientX - pending.offsetX,
          moveEvent.clientY - pending.offsetY,
        );

        const next = hitTest(moveEvent.clientX, moveEvent.clientY);
        if (!sameTarget(next, pending.target)) {
          pending.target = next;
          setDrag((current) => (current ? { ...current, target: next } : current));
        }
      };

      const onUp = (upEvent: PointerEvent) => {
        const pending = pendingRef.current;
        if (!pending || upEvent.pointerId !== pending.pointerId) return;
        teardown(true, { x: upEvent.clientX, y: upEvent.clientY });
      };

      const onCancel = () => teardown(false);

      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerup", onUp);
      element.addEventListener("pointercancel", onCancel);
      // Backstops: a release that escapes the captured element entirely.
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);

      const detach = () => {
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerup", onUp);
        element.removeEventListener("pointercancel", onCancel);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
        if (element.hasPointerCapture(event.pointerId)) {
          element.releasePointerCapture(event.pointerId);
        }
      };

      pendingRef.current = {
        issueId,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        width: rect.width,
        height: rect.height,
        element,
        armed: !isTouch,
        started: false,
        target: null,
        holdTimer: isTouch
          ? window.setTimeout(() => {
              const pending = pendingRef.current;
              if (!pending) return;
              pending.armed = true;
              pending.holdTimer = null;
              begin();
            }, TOUCH_HOLD_MS)
          : null,
        detach,
      };

      // Capture keeps the move stream coming even when the pointer
      // leaves the card. It throws if the pointer is already gone, which
      // is survivable — the window-level backstops still end the drag.
      try {
        element.setPointerCapture(event.pointerId);
      } catch {
        /* no capture available; the backstop listeners cover it */
      }
    },
    [teardown],
  );

  /** True once per completed drag, so the trailing click is ignored. */
  const consumeDragClick = useCallback(() => {
    if (!suppressClickRef.current) return false;
    suppressClickRef.current = false;
    return true;
  }, []);

  // A card unmounting mid-drag (a filter change, a route change) must
  // not leave listeners or a selection lock behind.
  useEffect(() => () => teardown(false), [teardown]);

  return { drag, startDrag, consumeDragClick };
}
