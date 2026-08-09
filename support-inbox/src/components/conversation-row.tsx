import { Link } from "react-router-dom";
import type { Conversation } from "@/content/types";
import {
  customerById,
  lastActivityAt,
  memberById,
  previewOf,
  slaFor,
} from "@/lib/derive";
import { relativeTime } from "@/lib/format";
import { Avatar, UnassignedAvatar } from "./avatar";
import { ChannelBadge, SlaLabel, StatusPill } from "./chips";

/**
 * One row of the inbox.
 *
 * Unread is carried by weight rather than by another colour — the row
 * already has a status dot and possibly a red rule, and a third signal
 * competing with those makes the list harder to read, not easier.
 *
 * The overdue rule down the left edge is the only place in the app
 * where a colour appears with no words beside it, which is why it gets
 * the whole left margin to itself.
 */
export function ConversationRow({
  conversation,
  active,
  selected,
  onSelectedChange,
  now,
}: {
  conversation: Conversation;
  active: boolean;
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
  now: number;
}) {
  const customer = customerById(conversation.customerId);
  const assignee = memberById(conversation.assigneeId);
  const sla = slaFor(conversation, now);
  const overdue = sla.kind === "overdue";

  return (
    <li
      className={`relative border-b border-line ${
        active ? "bg-accent-soft" : "bg-surface hover:bg-hover"
      }`}
    >
      {overdue ? (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[3px] bg-overdue"
        />
      ) : null}

      <div className="flex items-start gap-2 py-2.5 pr-3 pl-2.5">
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) => onSelectedChange(event.target.checked)}
          aria-label={`Select conversation ${conversation.ref}`}
          className="focus-ring mt-2 size-3.5 shrink-0 accent-accent"
        />

        <Link
          to={`/c/${conversation.id}`}
          className="focus-ring min-w-0 flex-1 rounded-sm"
        >
          <div className="flex items-baseline gap-2">
            <span
              className={`min-w-0 flex-1 truncate text-[13px] ${
                conversation.unread ? "font-semibold text-ink" : "text-ink-muted"
              }`}
            >
              {customer ? customer.name : "Unknown customer"}
            </span>
            <ChannelBadge channel={conversation.channel} />
            <span className="tabular shrink-0 font-mono text-[11px] text-ink-subtle">
              {relativeTime(
                new Date(lastActivityAt(conversation)).toISOString(),
                now,
              )}
            </span>
          </div>

          <div
            className={`mt-0.5 truncate text-[13px] ${
              conversation.unread ? "font-semibold text-ink" : "text-ink"
            }`}
          >
            {conversation.subject}
          </div>

          <div className="mt-0.5 truncate text-[12px] text-ink-subtle">
            {previewOf(conversation)}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <StatusPill status={conversation.status} short />
            <SlaLabel state={sla} />
            <span className="ml-auto flex items-center gap-1.5">
              <span className="tabular font-mono text-[11px] text-ink-subtle">
                #{conversation.ref}
              </span>
              {assignee ? (
                <Avatar
                  initials={assignee.initials}
                  name={assignee.name}
                  size="sm"
                />
              ) : (
                <UnassignedAvatar size="sm" />
              )}
            </span>
          </div>
        </Link>
      </div>
    </li>
  );
}
