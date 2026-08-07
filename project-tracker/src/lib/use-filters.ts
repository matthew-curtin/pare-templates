import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * View state that lives in the URL rather than in a component.
 *
 * Filters, the search box and the table's sort all go through here, so
 * a refresh keeps them, the back button steps through them, and a
 * filtered view can be sent to someone else. A value equal to its
 * fallback is removed from the query rather than written, which keeps
 * the default URL clean.
 */
export function useParam(
  key: string,
  fallback: string,
): [string, (next: string) => void] {
  const [params, setParams] = useSearchParams();
  const value = params.get(key) ?? fallback;

  const set = useCallback(
    (next: string) => {
      setParams(
        (previous) => {
          const updated = new URLSearchParams(previous);
          if (next === fallback || next === "") updated.delete(key);
          else updated.set(key, next);
          return updated;
        },
        { replace: true },
      );
    },
    [key, fallback, setParams],
  );

  return [value, set];
}

/**
 * Change several parameters as ONE update. Pass `null` to remove one.
 *
 * This is not a convenience. Two `useParam` setters called in the same
 * handler both compute their result from the parameters as they were at
 * the start of the tick, so the second silently discards the first —
 * which is how a sort control can set its column and its direction and
 * end up having set neither. Anything that changes more than one value
 * at a time has to come through here.
 */
export function useSetParams(): (
  updates: Record<string, string | null>,
) => void {
  const [, setParams] = useSearchParams();

  return useCallback(
    (updates) => {
      setParams(
        (previous) => {
          const updated = new URLSearchParams(previous);
          for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === "") updated.delete(key);
            else updated.set(key, value);
          }
          return updated;
        },
        { replace: true },
      );
    },
    [setParams],
  );
}
