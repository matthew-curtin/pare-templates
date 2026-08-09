import type { InboxView, NavItem, SlaPolicy, Tag } from "./types";

/**
 * Everything about the product and the team using it. The conversations
 * themselves are in conversations.ts.
 */
export const site = {
  appName: "Parley",
  appTagline: "Support inbox",

  /** The company whose customers write in. Invented — see the README. */
  workspace: "Thornbury Audio",
  workspaceDetail: "Portable speakers · UK and EU",

  /** Whoever is signed in. Drives "Assigned to me" and who replies. */
  currentMemberId: "m-nadia",

  /**
   * The clock the whole app is drawn against.
   *
   * Every timestamp in the content is relative to this instant, so
   * "4h ago" stays "4h ago" and the one overdue conversation stays
   * overdue. Without a fixed now, a template read six months after it
   * was written shows an inbox where everything breached days ago,
   * which is a different design from the one anyone intended.
   */
  now: "2026-03-12T14:20:00Z",
} as const;

export const nav: NavItem[] = [
  { to: "/", label: "Inbox", icon: "inbox" },
  { to: "/contacts", label: "Contacts", icon: "people" },
  { to: "/macros", label: "Saved replies", icon: "macro" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

/**
 * The saved filters across the top of the conversation list.
 *
 * "Unassigned" is first on purpose: an unowned conversation is the one
 * failure mode a shared inbox has that a personal one does not, and
 * putting it anywhere else means it is found last.
 */
export const views: InboxView[] = [
  { id: "unassigned", label: "Unassigned", status: "open", assignee: "unassigned" },
  { id: "mine", label: "Assigned to me", status: "all", assignee: "me" },
  { id: "open", label: "Open", status: "open", assignee: "all" },
  { id: "waiting", label: "Waiting on customer", status: "waiting", assignee: "all" },
  { id: "snoozed", label: "Snoozed", status: "snoozed", assignee: "all" },
  { id: "resolved", label: "Resolved", status: "resolved", assignee: "all" },
  { id: "all", label: "Everything", status: "all", assignee: "all" },
];

export const tags: Tag[] = [
  { id: "t-shipping", name: "Shipping" },
  { id: "t-firmware", name: "Firmware" },
  { id: "t-pairing", name: "Pairing" },
  { id: "t-battery", name: "Battery" },
  { id: "t-returns", name: "Returns" },
  { id: "t-billing", name: "Billing" },
  { id: "t-warranty", name: "Warranty" },
  { id: "t-idea", name: "Product idea" },
];

/**
 * What we have promised, by plan.
 *
 * These are the numbers the whole inbox is judged against, so they are
 * on the settings page where they can be changed and the list re-read.
 */
export const slaPolicies: SlaPolicy[] = [
  { plan: "Pro", firstResponseHours: 2 },
  { plan: "Standard", firstResponseHours: 8 },
  { plan: "Free", firstResponseHours: 24 },
];

/** Human-readable meaning of each status, for the settings page. */
export const statusMeanings: { status: string; label: string; meaning: string }[] =
  [
    {
      status: "open",
      label: "Open",
      meaning: "Waiting on us. The answering clock is running.",
    },
    {
      status: "waiting",
      label: "Waiting on customer",
      meaning:
        "We have replied and the ball is with them. The clock is stopped.",
    },
    {
      status: "snoozed",
      label: "Snoozed",
      meaning: "Parked until a date. Comes back to Open on its own.",
    },
    {
      status: "resolved",
      label: "Resolved",
      meaning: "Done. Reopens if the customer writes again.",
    },
  ];
