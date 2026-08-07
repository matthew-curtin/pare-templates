import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "./board-store";
import type { Issue } from "@/content/types";

/** Every issue, in board order. Re-renders when the board changes. */
export function useBoard(): Issue[] {
  return useSyncExternalStore(subscribe, getSnapshot);
}

/** One issue by key, or undefined if the key is not in the board. */
export function useIssue(id: string | undefined): Issue | undefined {
  const board = useBoard();
  return id ? board.find((issue) => issue.id === id) : undefined;
}
