"use client";

import { useSyncExternalStore } from "react";

const KEY = "overlap.plan.v1";

/**
 * A first visit arrives with a plan already in it.
 *
 * An empty plan page is the honest first-run state and it is also a
 * blank rectangle, which is a poor thing for a template to open on. So
 * the first visit is seeded — six sessions across three days, one pair
 * of which collides at 14:35 on the Thursday — and "Clear the plan"
 * puts you back to genuinely empty. Both states are reachable, which is
 * what CONVENTIONS §7b asks for, and the interesting one is the one you
 * land on.
 */
const SEED: readonly string[] = [
  "d1-04",
  "d1-16",
  "d2-08",
  "d2-19",
  "d2-20",
  "d3-08",
];

/**
 * localStorage is an external store, so it is read through
 * `useSyncExternalStore` rather than pulled into state by an effect.
 *
 * That is not ceremony. The effect version has to setState on mount,
 * which React now flags as a cascading render, and it has no answer for
 * two components reading the plan at once — they each keep their own
 * copy and drift. This has exactly one copy, and the server snapshot is
 * a separate stable empty array so a server render never claims to know
 * what is in someone's browser.
 *
 * Both snapshot getters must return a REFERENTIALLY STABLE value or
 * React re-renders forever: `getSnapshot` returns the cached array and
 * only replaces it when the plan actually changes.
 */
const EMPTY: string[] = [];

let cache: string[] | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (cache !== null) return cache;
  try {
    const stored = window.localStorage.getItem(KEY);
    cache = stored === null ? [...SEED] : (JSON.parse(stored) as string[]);
  } catch {
    // Blocked or corrupt localStorage is not worth a broken page.
    cache = [...SEED];
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private browsing. The plan still works for this session.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab editing the plan is the same event as this one editing
  // it, so the two stay in step for free.
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const clientReady = () => true;
const serverReady = () => false;

export interface PlanValue {
  ids: string[];
  /** False during the server render and the hydration pass, because
   *  neither can know what is in this browser. */
  ready: boolean;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  clear: () => void;
  reseed: () => void;
}

export function usePlan(): PlanValue {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);

  return {
    ids,
    ready,
    has: (id: string) => ids.includes(id),
    toggle: (id: string) =>
      write(
        ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
      ),
    clear: () => write([]),
    reseed: () => write([...SEED]),
  };
}
