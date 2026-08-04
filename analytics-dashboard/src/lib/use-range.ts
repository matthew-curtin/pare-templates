import { useSearchParams } from "react-router-dom";
import { ranges } from "@/content/metrics";
import type { Range, RangeId } from "@/content/types";

const DEFAULT: RangeId = "30d";

/**
 * The selected date range, kept in the URL.
 *
 * `?range=7d` rather than component state, so a refresh keeps the
 * range, the back button steps through it, and a link to "the last 7
 * days" is a link somebody can send. An unrecognised value falls back
 * to the default rather than rendering an empty dashboard.
 */
export function useRange(): [Range, (id: RangeId) => void] {
  const [params, setParams] = useSearchParams();
  const requested = params.get("range");
  const range =
    ranges.find((candidate) => candidate.id === requested) ??
    ranges.find((candidate) => candidate.id === DEFAULT)!;

  const setRange = (id: RangeId) => {
    const next = new URLSearchParams(params);
    if (id === DEFAULT) next.delete("range");
    else next.set("range", id);
    // `replace` so flipping between ranges does not fill the history
    // with entries nobody wants to step back through.
    setParams(next, { replace: true });
  };

  return [range, setRange];
}
