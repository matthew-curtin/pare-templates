import type { Column, Label, NavItem, Priority } from "./types";

/**
 * The app itself, and the workspace inside it.
 *
 * Cadence is the tracker. Lantern is the fictional product the team in
 * this workspace is building — a shared inbox for support teams. Both
 * are invented.
 */
export const site = {
  appName: "Cadence",
  appTagline: "Project tracker",
  workspace: "Lantern",
  workspaceDetail: "Product team · Cycle 24",
  /** Prefix on every issue key. Change it and the whole board follows. */
  issuePrefix: "LAN",
  cycle: {
    name: "Cycle 24",
    starts: "2026-07-27",
    ends: "2026-08-07",
  },
  /**
   * "Today", for every relative date in the app.
   *
   * Deliberately a fixed date rather than the real clock. The issues in
   * this template are dated, so reading them against the real today
   * would have the board saying "updated 8 months ago" to anyone who
   * opens it next year — which looks like neglect rather than a
   * template. Anchoring here keeps it reading as a live board forever.
   *
   * Point this at the real clock if you are turning the template into
   * something real: `new Date().toISOString().slice(0, 10)`.
   */
  today: "2026-08-06",
};

export const nav: NavItem[] = [
  { label: "Board", to: "/", icon: "board" },
  { label: "Backlog", to: "/backlog", icon: "backlog" },
  { label: "Roadmap", to: "/roadmap", icon: "roadmap" },
  { label: "Team", to: "/team", icon: "team" },
  { label: "Settings", to: "/settings", icon: "settings" },
];

/**
 * The board, left to right.
 *
 * The two ends have no WIP limit on purpose: everything arrives in the
 * first and accumulates in the last, so a limit there would be a
 * permanent warning that means nothing.
 */
export const columns: Column[] = [
  {
    id: "backlog",
    name: "Backlog",
    hint: "Agreed, not scheduled",
    wipLimit: null,
  },
  {
    id: "todo",
    name: "To do",
    hint: "Picked up this cycle",
    wipLimit: 8,
  },
  {
    id: "building",
    name: "Building",
    hint: "Someone is on it now",
    wipLimit: 4,
  },
  {
    id: "review",
    name: "In review",
    hint: "Waiting on another pair of eyes",
    wipLimit: 3,
  },
  {
    id: "done",
    name: "Done",
    hint: "Shipped this cycle",
    wipLimit: null,
  },
];

export const labels: Label[] = [
  { id: "inbox", name: "Inbox" },
  { id: "platform", name: "Platform" },
  { id: "design", name: "Design" },
  { id: "performance", name: "Performance" },
  { id: "accessibility", name: "Accessibility" },
  { id: "bug", name: "Bug" },
  { id: "infra", name: "Infra" },
  { id: "docs", name: "Docs" },
];

/** Display order and wording for the priority scale. */
export const priorities: { id: Priority; name: string }[] = [
  { id: "urgent", name: "Urgent" },
  { id: "high", name: "High" },
  { id: "medium", name: "Medium" },
  { id: "low", name: "Low" },
];

export const footerNote =
  "Cadence, Lantern, the people and every issue here are invented. " +
  "Nothing in this template talks to a server.";
