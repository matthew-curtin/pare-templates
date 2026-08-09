import { useEffect, useLayoutEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, UnassignedAvatar } from "@/components/avatar";
import {
  ChannelBadge,
  PlanBadge,
  SlaLabel,
  StatusPill,
  TagChip,
} from "@/components/chips";
import { Composer } from "@/components/composer";
import { Button, MenuItem, Popover } from "@/components/controls";
import { MessageBubble } from "@/components/message";
import { NavIcon } from "@/components/nav-icon";
import { site, statusMeanings, tags } from "@/content/site";
import { team } from "@/content/team";
import type { Status } from "@/content/types";
import {
  customerById,
  hoursForPlan,
  memberById,
  NOW,
  slaFor,
} from "@/lib/derive";
import { longDate, untilLabel } from "@/lib/format";
import { assign, markRead, setStatus, toggleTag } from "@/lib/inbox-store";
import { useConversation, useConversations } from "@/lib/use-inbox";

/** Snoozing offers a few sensible whens rather than a date picker. */
const SNOOZE_OPTIONS = [
  { label: "Tomorrow morning", hours: 19 },
  { label: "In three days", hours: 72 },
  { label: "Next week", hours: 168 },
];

export function ConversationPage() {
  const { id } = useParams();
  const conversation = useConversation(id);
  const all = useConversations();
  const threadRef = useRef<HTMLDivElement | null>(null);
  const messageCount = conversation?.messages.length ?? 0;

  // Opening a conversation reads it. Done in an effect rather than in
  // the row's click handler so that arriving by keyboard, by back
  // button, or by a pasted link all count as reading it too.
  useEffect(() => {
    if (conversation?.unread) markRead(conversation.id);
  }, [conversation?.id, conversation?.unread]);

  /**
   * Open at the newest message, and stay there after sending one.
   *
   * The message that needs answering is the last one, and an
   * eight-message thread that opens at the top hides it below the fold
   * — so the first thing you would do on every long conversation is
   * scroll to the end of it.
   *
   * `useLayoutEffect` rather than `useEffect` because this has to
   * happen before the browser paints; done afterwards the thread is
   * visibly at the top for a frame and then jumps.
   *
   * `messageCount` is in the dependencies so that sending puts your own
   * new message on screen rather than leaving you looking at the one
   * above it.
   *
   * Desktop only, and deliberately. Below `lg` the thread is not a
   * scroller — the page is — so this is a no-op there and a phone opens
   * at the top of the conversation. That is the right way round: on a
   * narrow screen the subject, the status and who it is assigned to are
   * worth seeing first, and jumping the page past them to reach the
   * newest message would hide all three.
   */
  useLayoutEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [id, messageCount]);

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <h1 className="text-[15px] font-semibold">That conversation is gone</h1>
        <p className="text-[13px] text-ink-muted">
          It may have been merged into another one.
        </p>
        <Link
          to="/"
          className="focus-ring mt-2 rounded-sm text-[13px] text-accent hover:text-accent-hover"
        >
          Back to the inbox
        </Link>
      </div>
    );
  }

  const customer = customerById(conversation.customerId);
  const assignee = memberById(conversation.assigneeId);
  const sla = slaFor(conversation, NOW);
  const history = customer
    ? all.filter(
        (candidate) =>
          candidate.customerId === customer.id &&
          candidate.id !== conversation.id,
      )
    : [];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-b border-line bg-surface px-4 py-3">
        <div className="flex items-start gap-2">
          <Link
            to="/"
            aria-label="Back to the inbox"
            className="focus-ring -ml-1 rounded-md p-1 text-ink-muted hover:bg-hover hover:text-ink lg:hidden"
          >
            <NavIcon name="back" className="size-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-[15px] leading-snug font-semibold text-balance text-ink">
              {conversation.subject}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-ink-subtle">
              <span className="tabular font-mono">#{conversation.ref}</span>
              <ChannelBadge channel={conversation.channel} withLabel />
              {customer ? (
                <Link
                  to={`/contacts/${customer.id}`}
                  className="focus-ring rounded-sm text-accent hover:text-accent-hover"
                >
                  {customer.name}
                </Link>
              ) : null}
              <SlaLabel state={sla} />
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <StatusControl
            id={conversation.id}
            status={conversation.status}
            snoozedUntil={conversation.snoozedUntil}
          />
          <Popover
            trigger={(props) => (
              <Button {...props} tone="quiet">
                {assignee ? (
                  <>
                    <Avatar
                      initials={assignee.initials}
                      name={assignee.name}
                      size="sm"
                    />
                    {assignee.name}
                  </>
                ) : (
                  <>
                    <UnassignedAvatar size="sm" />
                    Unassigned
                  </>
                )}
              </Button>
            )}
          >
            {(close) => (
              <>
                {team.map((member) => (
                  <MenuItem
                    key={member.id}
                    selected={member.id === conversation.assigneeId}
                    onClick={() => {
                      assign(conversation.id, member.id);
                      close();
                    }}
                  >
                    {member.name}
                    {member.id === site.currentMemberId ? (
                      <span className="text-[11px] text-ink-subtle">(you)</span>
                    ) : null}
                  </MenuItem>
                ))}
                <MenuItem
                  selected={conversation.assigneeId === null}
                  onClick={() => {
                    assign(conversation.id, null);
                    close();
                  }}
                >
                  Nobody
                </MenuItem>
              </>
            )}
          </Popover>

          <Popover
            align="right"
            trigger={(props) => (
              <Button {...props} tone="quiet" icon="tag">
                Tags
              </Button>
            )}
          >
            {() => (
              <div className="max-h-72 overflow-y-auto">
                {tags.map((tag) => (
                  <MenuItem
                    key={tag.id}
                    selected={conversation.tagIds.includes(tag.id)}
                    onClick={() => toggleTag(conversation.id, tag.id)}
                  >
                    {tag.name}
                  </MenuItem>
                ))}
              </div>
            )}
          </Popover>

          <div className="flex flex-wrap items-center gap-1.5">
            {conversation.tagIds.map((tagId) => {
              const tag = tags.find((candidate) => candidate.id === tagId);
              if (!tag) return null;
              return (
                <TagChip
                  key={tagId}
                  name={tag.name}
                  onRemove={() => toggleTag(conversation.id, tagId)}
                />
              );
            })}
          </div>
        </div>

        {conversation.status === "snoozed" && conversation.snoozedUntil ? (
          <p className="mt-2 text-[12px] text-ink-muted">
            Parked until {untilLabel(conversation.snoozedUntil, NOW)}. It comes
            back to Open on its own.
          </p>
        ) : null}
      </header>

      <div className="min-h-0 flex-1 lg:flex lg:overflow-hidden">
        <div ref={threadRef} className="scroll-thin min-w-0 flex-1 lg:overflow-y-auto">
          <ul className="space-y-3 px-4 py-4">
            {conversation.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                customer={customer}
              />
            ))}
          </ul>
        </div>

        {customer ? (
          <aside
            aria-label="About this customer"
            className="scroll-thin shrink-0 border-t border-line bg-canvas px-4 py-4 lg:w-64 lg:overflow-y-auto lg:border-t-0 lg:border-l xl:w-72"
          >
            <div className="flex items-center gap-2.5">
              <Avatar
                initials={customer.initials}
                name={customer.name}
                size="lg"
                tone="customer"
              />
              <div className="min-w-0">
                <Link
                  to={`/contacts/${customer.id}`}
                  className="focus-ring block truncate rounded-sm text-[14px] font-semibold text-ink hover:text-accent"
                >
                  {customer.name}
                </Link>
                <div className="truncate text-[12px] text-ink-subtle">
                  {customer.company === "—" ? customer.location : customer.company}
                </div>
              </div>
            </div>

            <dl className="mt-4 space-y-2.5 text-[12px]">
              <Row label="Plan">
                <PlanBadge plan={customer.plan} />
              </Row>
              <Row label="Reply promised within">
                <span className="tabular font-mono">
                  {hoursForPlan(customer.plan)}h
                </span>
              </Row>
              <Row label="Email">
                <span className="prose-wrap text-ink-muted">
                  {customer.email}
                </span>
              </Row>
              <Row label="Where">
                <span className="text-ink-muted">{customer.location}</span>
              </Row>
              <Row label="Customer since">
                <span className="text-ink-muted">{longDate(customer.since)}</span>
              </Row>
            </dl>

            {customer.note ? (
              <div className="mt-4 rounded-lg border border-line bg-surface p-3">
                <div className="text-[11px] font-medium tracking-wide text-ink-subtle uppercase">
                  Worth knowing
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-ink">
                  {customer.note}
                </p>
              </div>
            ) : null}

            <div className="mt-4">
              <div className="text-[11px] font-medium tracking-wide text-ink-subtle uppercase">
                Earlier conversations
              </div>
              {history.length === 0 ? (
                <p className="mt-1.5 text-[12px] text-ink-subtle">
                  This is the first time they have written in.
                </p>
              ) : (
                <ul className="mt-1.5 space-y-1.5">
                  {history.map((earlier) => (
                    <li key={earlier.id}>
                      <Link
                        to={`/c/${earlier.id}`}
                        className="focus-ring block rounded-md border border-line bg-surface px-2.5 py-1.5 hover:bg-hover"
                      >
                        <span className="block truncate text-[12px] text-ink">
                          {earlier.subject}
                        </span>
                        <span className="mt-0.5 block">
                          <StatusPill status={earlier.status} short />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        ) : null}
      </div>

      <Composer conversationId={conversation.id} />
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-ink-subtle">{label}</dt>
      <dd className="min-w-0 text-right">{children}</dd>
    </div>
  );
}

function StatusControl({
  id,
  status,
  snoozedUntil,
}: {
  id: string;
  status: Status;
  snoozedUntil: string | null;
}) {
  return (
    <Popover
      width="w-64"
      trigger={(props) => (
        <Button {...props} tone="quiet">
          <StatusPill status={status} />
          <NavIcon name="chevron" className="size-3.5 text-ink-subtle" />
        </Button>
      )}
    >
      {(close) => (
        <>
          {statusMeanings
            .filter((entry) => entry.status !== "snoozed")
            .map((entry) => (
              <MenuItem
                key={entry.status}
                selected={entry.status === status}
                onClick={() => {
                  setStatus(id, entry.status as Status);
                  close();
                }}
              >
                <span className="min-w-0">
                  <span className="block text-[13px]">{entry.label}</span>
                  <span className="block text-[11px] text-ink-subtle">
                    {entry.meaning}
                  </span>
                </span>
              </MenuItem>
            ))}
          <div className="my-1 border-t border-line" />
          <div className="px-3 pt-1 pb-1 text-[11px] font-medium tracking-wide text-ink-subtle uppercase">
            Snooze until
          </div>
          {SNOOZE_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              selected={status === "snoozed" && snoozedUntil !== null}
              onClick={() => {
                setStatus(
                  id,
                  "snoozed",
                  new Date(NOW + option.hours * 3600_000).toISOString(),
                );
                close();
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </>
      )}
    </Popover>
  );
}
