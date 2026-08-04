import type { Member, NavItem, Workspace } from "./types";

export const site = {
  name: "Orrery",
  tagline: "Product analytics that shows the whole system moving",
  /** Shown in the sidebar under the workspace name. */
  environment: "Production",
} as const;

export const nav: NavItem[] = [
  { label: "Overview", to: "/", icon: "overview" },
  { label: "Audience", to: "/audience", icon: "audience" },
  { label: "Funnels", to: "/funnels", icon: "funnels" },
  { label: "Events", to: "/events", icon: "events" },
  { label: "Settings", to: "/settings", icon: "settings" },
];

export const workspace: Workspace = {
  name: "Fieldnote",
  plan: "Business",
  region: "EU (Frankfurt)",
  retentionMonths: 24,
};

export const members: Member[] = [
  {
    name: "Priya Raman",
    email: "priya@fieldnote.example",
    role: "Owner",
    initials: "PR",
  },
  {
    name: "Dan Okonkwo",
    email: "dan@fieldnote.example",
    role: "Admin",
    initials: "DO",
  },
  {
    name: "Marta Lang",
    email: "marta@fieldnote.example",
    role: "Analyst",
    initials: "ML",
  },
  {
    name: "Ash Whitfield",
    email: "ash@fieldnote.example",
    role: "Analyst",
    initials: "AW",
  },
  {
    name: "Cole Devereux",
    email: "cole@fieldnote.example",
    role: "Viewer",
    initials: "CD",
  },
];

/** The signed-in user, shown at the foot of the sidebar. */
export const currentUser = members[0];
