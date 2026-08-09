"use client";

import { usePlan } from "@/lib/plan-store";

/**
 * The one control that appears on every session, everywhere.
 *
 * It renders a placeholder of the same size before the plan has loaded
 * rather than nothing, because the plan lives in localStorage and the
 * server cannot know it — and a button that pops into existence after
 * hydration shifts the block it sits in. The `aria-pressed` is the real
 * state; the plus and minus are decoration on top of it.
 */
export function PlanToggle({
  sessionId,
  title,
  size = "sm",
}: {
  sessionId: string;
  title: string;
  size?: "sm" | "md";
}) {
  const { has, toggle, ready } = usePlan();
  const on = has(sessionId);

  const box =
    size === "md"
      ? "px-3 py-1.5 text-[0.875rem]"
      : "px-1.5 py-0.5 text-[0.75rem]";

  if (!ready) {
    return <span className={`${box} invisible`} aria-hidden="true" >+ Plan</span>;
  }

  return (
    <button
      type="button"
      onClick={() => toggle(sessionId)}
      aria-pressed={on}
      aria-label={
        on ? `Remove ${title} from your plan` : `Add ${title} to your plan`
      }
      className={`focus-ring narrow shrink-0 border transition-colors ${box} ${
        on
          ? "border-ink bg-ink text-ink-inverse"
          : "border-line-strong text-ink-muted hover:border-ink hover:text-ink"
      }`}
    >
      {on ? "✓ Planned" : "+ Plan"}
    </button>
  );
}
