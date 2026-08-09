/**
 * Every content shape in the app, in one place.
 *
 * If you are changing what a template *says*, you want the other files
 * in this folder. This one describes their shape, so the editor tells
 * you immediately when a field is missing.
 */

/**
 * Where a conversation has got to.
 *
 * Four unordered states, not a ladder: `waiting` and `snoozed` both
 * mean "not on you right now" and differ in what unparks them — a
 * reply from the customer, or a date.
 */
export type Status = "open" | "waiting" | "snoozed" | "resolved";

/** How the customer reached us. */
export type Channel = "email" | "chat" | "social";

/**
 * What the customer pays for, which is the only thing that decides how
 * fast we have promised to answer them. See `slaPolicies` in site.ts.
 */
export type Plan = "Free" | "Standard" | "Pro";

export interface Member {
  id: string;
  name: string;
  role: string;
  /** Two letters, drawn as an avatar. No stock headshots — see CREDITS. */
  initials: string;
  email: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  plan: Plan;
  location: string;
  /** ISO date they first bought something. */
  since: string;
  initials: string;
  /** What an agent should know before replying. Optional on purpose. */
  note: string | null;
}

export interface Tag {
  id: string;
  name: string;
}

/**
 * Three kinds of message, and the difference between them is the whole
 * point of the thread.
 *
 * `inbound` is the customer. `reply` is what we sent them, and it is
 * the only kind that stops the answering clock. `note` is internal —
 * visible to the team, never to the customer, and deliberately does
 * NOT stop the clock, because writing a note to a colleague is not
 * answering anybody.
 */
export type MessageKind = "inbound" | "reply" | "note";

export interface Message {
  id: string;
  kind: MessageKind;
  /** A customer id for `inbound`; a member id for `reply` and `note`. */
  authorId: string;
  /** ISO. Everything is rendered relative to `site.now`. */
  at: string;
  /** Paragraphs. Plain text — this template deliberately has no parser. */
  body: string[];
}

export interface Conversation {
  id: string;
  /** The number a customer quotes back at you. */
  ref: string;
  subject: string;
  customerId: string;
  channel: Channel;
  status: Status;
  /** `null` means nobody has picked it up. */
  assigneeId: string | null;
  tagIds: string[];
  unread: boolean;
  /** ISO. Only meaningful while `status` is "snoozed". */
  snoozedUntil: string | null;
  messages: Message[];
}

/** A saved reply. Editable on /macros, insertable in the composer. */
export interface Macro {
  id: string;
  name: string;
  /** What it is for, shown under the name in the picker. */
  hint: string;
  body: string;
}

/**
 * How quickly we have promised to send a *first* reply, by plan.
 *
 * First response rather than resolution, because resolution time
 * depends on the customer answering and would put half the inbox
 * permanently in the red through nobody's fault.
 */
export interface SlaPolicy {
  plan: Plan;
  firstResponseHours: number;
}

/** One of the saved filters across the top of the conversation list. */
export interface InboxView {
  id: string;
  label: string;
  status: Status | "all";
  /** "me" resolves against `site.currentMemberId`. */
  assignee: "all" | "me" | "unassigned";
}

export interface NavItem {
  to: string;
  label: string;
  icon: string;
}
