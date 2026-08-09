import type { Channel, Plan, Status } from "@/content/types";
import { duration } from "@/lib/format";
import { isDueSoon, type SlaState } from "@/lib/sla";
import { NavIcon } from "./nav-icon";

/**
 * The small labelled things.
 *
 * Every class list here is written out in full rather than assembled
 * from a token name. Tailwind reads the source as text, so a class
 * built as `bg-${status}-soft` is a class it never sees and never
 * generates — the component compiles, the page renders, and the pill is
 * transparent.
 */

const STATUS_STYLES: Record<Status, { label: string; box: string; dot: string }> =
  {
    open: {
      label: "Open",
      box: "bg-open-soft text-ink",
      dot: "bg-open",
    },
    waiting: {
      label: "Waiting on customer",
      box: "bg-waiting-soft text-ink",
      dot: "bg-waiting",
    },
    snoozed: {
      label: "Snoozed",
      box: "bg-snoozed-soft text-ink",
      dot: "bg-snoozed",
    },
    resolved: {
      label: "Resolved",
      box: "bg-resolved-soft text-ink",
      dot: "bg-resolved",
    },
  };

export function StatusPill({
  status,
  short = false,
}: {
  status: Status;
  /** The list has no room for "Waiting on customer". */
  short?: boolean;
}) {
  const style = STATUS_STYLES[status];
  const label = short && status === "waiting" ? "Waiting" : style.label;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${style.box}`}
    >
      <span className={`size-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}

/**
 * How long is left, or how long ago we ran out.
 *
 * Only the overdue case gets a colour. Time simply running is the
 * normal state of most of the inbox, and colouring it would put a
 * warning on nearly every row — at which point it stops being read as
 * one at all.
 */
export function SlaLabel({ state }: { state: SlaState }) {
  if (state.kind === "stopped") return null;
  if (state.kind === "overdue") {
    return (
      <span className="tabular inline-flex items-center gap-1 font-mono text-[11px] font-medium text-overdue">
        <NavIcon name="clock" className="size-3" />
        {duration(state.msOver)} overdue
      </span>
    );
  }
  return (
    <span
      className={`tabular inline-flex items-center gap-1 font-mono text-[11px] ${
        isDueSoon(state) ? "font-medium text-ink" : "text-ink-subtle"
      }`}
    >
      <NavIcon name="clock" className="size-3" />
      {duration(state.msLeft)} left
    </span>
  );
}

export function TagChip({
  name,
  onRemove,
}: {
  name: string;
  onRemove?: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-line bg-canvas px-1.5 py-0.5 text-[11px] text-ink-muted">
      {name}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove the ${name} tag`}
          className="focus-ring -mr-0.5 rounded-sm p-0.5 text-ink-subtle hover:text-ink"
        >
          <NavIcon name="close" className="size-2.5" />
        </button>
      ) : null}
    </span>
  );
}

const CHANNEL_LABELS: Record<Channel, string> = {
  email: "Email",
  chat: "Live chat",
  social: "Social",
};

export function ChannelBadge({
  channel,
  withLabel = false,
}: {
  channel: Channel;
  withLabel?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 text-ink-subtle"
      title={CHANNEL_LABELS[channel]}
    >
      <NavIcon name={channel} className="size-3.5" />
      {withLabel ? (
        <span className="text-[11px]">{CHANNEL_LABELS[channel]}</span>
      ) : (
        <span className="sr-only">{CHANNEL_LABELS[channel]}</span>
      )}
    </span>
  );
}

/**
 * The plan, which is the only reason two identical questions can have
 * different deadlines — so it is worth showing wherever the clock is.
 */
export function PlanBadge({ plan }: { plan: Plan }) {
  const emphasis =
    plan === "Pro"
      ? "border-accent-ring bg-accent-soft text-accent"
      : "border-line bg-canvas text-ink-muted";
  return (
    <span
      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${emphasis}`}
    >
      {plan}
    </span>
  );
}
