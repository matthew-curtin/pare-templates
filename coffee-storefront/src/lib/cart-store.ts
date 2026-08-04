import { getCoffee, getSize } from "@/content/coffees";
import type { CartLine } from "@/content/types";

const STORAGE_KEY = "ridgeline-cart-v1";

export type CartState = {
  lines: CartLine[];
  /** False until localStorage has been read. The header badge uses
   *  this to avoid rendering a count that is about to change. */
  loaded: boolean;
};

/**
 * The basket, held outside React and read through
 * `useSyncExternalStore`.
 *
 * Why not `useState` plus an effect that reads localStorage: the
 * server has no access to the basket, so the server-rendered HTML must
 * show an empty one. Reading storage during render would produce
 * markup the server never generated (a hydration error), and reading
 * it in an effect means calling setState synchronously inside that
 * effect, which is the cascading-render pattern React now warns about.
 *
 * `useSyncExternalStore` is built for exactly this shape: it renders
 * `getServerSnapshot` during hydration and switches to `getSnapshot`
 * immediately afterwards, with no mismatch and no effect. Listening
 * for the `storage` event on the way past means two open tabs stay in
 * agreement about what is in the basket, which the effect version did
 * not do.
 */

/** Must be reference-stable — React compares snapshots by identity. */
const SERVER_STATE: CartState = { lines: [], loaded: false };

let state: CartState = SERVER_STATE;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

/** Anything in storage could be from an older version of the shop, or
 *  hand-edited, or name a coffee we no longer sell. Drop what we
 *  cannot resolve rather than rendering a broken line. */
function parseStored(raw: string): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is CartLine => {
      if (typeof entry !== "object" || entry === null) return false;
      const line = entry as Partial<CartLine>;
      if (
        typeof line.id !== "string" ||
        typeof line.coffeeSlug !== "string" ||
        typeof line.sizeId !== "string" ||
        typeof line.grindId !== "string" ||
        typeof line.quantity !== "number" ||
        !Number.isFinite(line.quantity) ||
        line.quantity < 1
      ) {
        return false;
      }
      const coffee = getCoffee(line.coffeeSlug);
      return !!coffee && !!getSize(coffee, line.sizeId);
    });
  } catch {
    return [];
  }
}

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? parseStored(raw) : [];
}

function commit(lines: CartLine[]): void {
  state = { lines, loaded: true };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }
  emit();
}

function handleStorageEvent(event: StorageEvent): void {
  if (event.key !== STORAGE_KEY) return;
  // Another tab changed the basket. Take its version without writing
  // back, or the two tabs would ping-pong.
  state = { lines: event.newValue ? parseStored(event.newValue) : [], loaded: true };
  emit();
}

export function subscribe(listener: () => void): () => void {
  // First subscriber loads the basket. This runs inside React's
  // subscribe step, and React re-reads the snapshot straight
  // afterwards, so the freshly loaded state is picked up without an
  // extra render pass.
  if (!state.loaded) {
    state = { lines: readStorage(), loaded: true };
  }

  if (listeners.size === 0 && typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageEvent);
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

export function getSnapshot(): CartState {
  return state;
}

export function getServerSnapshot(): CartState {
  return SERVER_STATE;
}

/** Size and grind make a line distinct: the same coffee ground two
 *  ways is two lines, because they are two different things to post. */
export function lineId(
  coffeeSlug: string,
  sizeId: string,
  grindId: string
): string {
  return `${coffeeSlug}:${sizeId}:${grindId}`;
}

export function addLine(
  coffeeSlug: string,
  sizeId: string,
  grindId: string,
  quantity = 1
): void {
  const id = lineId(coffeeSlug, sizeId, grindId);
  const existing = state.lines.find((line) => line.id === id);
  commit(
    existing
      ? state.lines.map((line) =>
          line.id === id ? { ...line, quantity: line.quantity + quantity } : line
        )
      : [...state.lines, { id, coffeeSlug, sizeId, grindId, quantity }]
  );
}

export function setLineQuantity(id: string, quantity: number): void {
  commit(
    quantity < 1
      ? state.lines.filter((line) => line.id !== id)
      : state.lines.map((line) =>
          line.id === id ? { ...line, quantity } : line
        )
  );
}

export function removeLine(id: string): void {
  commit(state.lines.filter((line) => line.id !== id));
}

export function clearCart(): void {
  commit([]);
}
