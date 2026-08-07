import { labels } from "@/content/site";
import type { Priority } from "@/content/types";
import { priorityChip, priorityLabel } from "@/lib/tokens";

const labelName = new Map(labels.map((label) => [label.id, label.name]));

/**
 * Priority, as a tinted chip.
 *
 * The word is always present. Priority is the one scale in this app
 * that could plausibly be reduced to a coloured dot, and reducing it
 * would make the busiest view in the product unreadable for anyone who
 * cannot separate the red from the amber.
 */
export function PriorityChip({ priority }: { priority: Priority }) {
  return (
    <span
      className={`${priorityChip[priority]} inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium`}
    >
      {priorityLabel[priority]}
    </span>
  );
}

/**
 * A label. Deliberately uncoloured — labels are nominal, there can be
 * eight of them on screen at once, and eight competing hues would
 * drown the two places in the card where colour actually means
 * something.
 */
export function LabelChip({ id }: { id: string }) {
  return (
    <span className="inline-flex items-center rounded border border-line-strong px-1.5 py-0.5 text-[11px] text-ink-muted">
      {labelName.get(id) ?? id}
    </span>
  );
}

/** The estimate. Mono, so a column of them lines up. */
export function PointsChip({ points }: { points: number }) {
  return (
    <span
      className="tabular inline-flex h-5 min-w-5 items-center justify-center rounded bg-canvas px-1 font-mono text-[11px] text-ink-muted"
      title={`${points} points`}
    >
      {points}
    </span>
  );
}
