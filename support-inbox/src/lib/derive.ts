import { customers } from "@/content/customers";
import { site, slaPolicies, tags } from "@/content/site";
import { team } from "@/content/team";
import type {
  Conversation,
  Customer,
  Member,
  Message,
  Plan,
  Tag,
} from "@/content/types";
import { slaState, type SlaState } from "./sla";

/**
 * Everything that needs to look something up in `src/content/`.
 *
 * Kept apart from `sla.ts` and `filters.ts`, which have no imports at
 * all so they can be run directly by `scripts/check-sla.mjs`. The rules
 * live there; the lookups live here.
 */

export const NOW = Date.parse(site.now);

export function memberById(id: string | null): Member | undefined {
  return id ? team.find((member) => member.id === id) : undefined;
}

export function customerById(id: string): Customer | undefined {
  return customers.find((customer) => customer.id === id);
}

export function tagById(id: string): Tag | undefined {
  return tags.find((tag) => tag.id === id);
}

export function hoursForPlan(plan: Plan): number {
  const policy = slaPolicies.find((candidate) => candidate.plan === plan);
  return policy ? policy.firstResponseHours : 24;
}

export function lastMessage(conversation: Conversation): Message | undefined {
  return conversation.messages[conversation.messages.length - 1];
}

export function lastActivityAt(conversation: Conversation): number {
  const message = lastMessage(conversation);
  return message ? Date.parse(message.at) : 0;
}

/** The clock for this conversation, using its customer's plan. */
export function slaFor(conversation: Conversation, now = NOW): SlaState {
  const customer = customerById(conversation.customerId);
  return slaState({
    status: conversation.status,
    messages: conversation.messages,
    firstResponseHours: hoursForPlan(customer ? customer.plan : "Free"),
    now,
  });
}

/**
 * One line from the newest message, for the list.
 *
 * An internal note is prefixed rather than hidden. A row whose preview
 * is a colleague's note reading like the customer's own words is worse
 * than no preview — you answer the wrong person.
 */
export function previewOf(conversation: Conversation): string {
  const message = lastMessage(conversation);
  if (!message) return "No messages yet";
  const text = message.body.join(" ");
  if (message.kind === "note") return `Note: ${text}`;
  if (message.kind === "reply") return `You: ${text}`;
  return text;
}

/**
 * Everything a search should look through: the subject, the reference,
 * the customer, and the words of every message.
 *
 * Built per conversation rather than per keystroke — searching the
 * bodies is the difference between finding a thread by the one phrase
 * you remember from it and not finding it at all.
 */
export function searchTextOf(conversation: Conversation): string {
  const customer = customerById(conversation.customerId);
  const assignee = memberById(conversation.assigneeId);
  const tagNames = conversation.tagIds
    .map((id) => tagById(id)?.name ?? "")
    .join(" ");
  const bodies = conversation.messages
    .map((message) => message.body.join(" "))
    .join(" ");
  return [
    conversation.ref,
    conversation.subject,
    customer?.name ?? "",
    customer?.company ?? "",
    customer?.email ?? "",
    assignee?.name ?? "",
    tagNames,
    bodies,
  ].join(" ");
}
