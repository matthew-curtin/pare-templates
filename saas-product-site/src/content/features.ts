import type { Feature } from "./types";

export const features: Feature[] = [
  {
    id: "flow",
    title: "Flow analytics",
    summary: "See where work actually slows down, not where you think it does.",
    description:
      "Cadence watches the whole path from first commit to production and shows you the shape of it. Every stage is measured, so a week that felt busy and a week that actually moved are easy to tell apart.",
    icon: "chart",
    points: [
      "Cycle time broken out by stage",
      "Trend lines across sprints and quarters",
      "Automatic outlier detection on stuck work",
    ],
  },
  {
    id: "review",
    title: "Review insights",
    summary: "Turn code review from a black box into a measurable stage.",
    description:
      "Review is usually the longest and least visible part of shipping. Cadence surfaces how long changes wait, who is carrying the load, and which pull requests are about to go stale.",
    icon: "clock",
    points: [
      "Time-to-first-review and time-to-merge",
      "Reviewer load balancing",
      "Stale pull request alerts",
    ],
  },
  {
    id: "teams",
    title: "Team health",
    summary: "Signals about workload and focus, without surveillance.",
    description:
      "Every metric is reported at team level and framed around the process, never ranked individuals. The goal is to find the parts of the system that make good work hard.",
    icon: "users",
    points: [
      "Team-level reporting by default",
      "Focus time and interruption patterns",
      "Onboarding ramp tracking for new joiners",
    ],
  },
  {
    id: "security",
    title: "Enterprise ready",
    summary: "SSO, audit logs and data residency from day one.",
    description:
      "Cadence is built to pass a security review. Single sign-on, granular roles and a complete audit trail come standard, and your data stays in the region you choose.",
    icon: "shield",
    points: [
      "SAML and SCIM provisioning",
      "Role-based access control",
      "SOC 2 Type II and regional data residency",
    ],
  },
  {
    id: "integrations",
    title: "Connects to your stack",
    summary: "Reads from the tools your team already uses.",
    description:
      "Point Cadence at your repositories and issue tracker and it starts building a picture within minutes. There is nothing to install in your build and no agent to run.",
    icon: "plug",
    points: [
      "GitHub, GitLab and Bitbucket",
      "Jira, Linear and Shortcut",
      "Slack digests and webhook exports",
    ],
  },
  {
    id: "reports",
    title: "Reports that write themselves",
    summary: "The weekly update, drafted before you ask for it.",
    description:
      "Cadence assembles a plain-language summary of what shipped, what slipped and what changed, ready to send on. It reads like something a person wrote, because it is edited to.",
    icon: "sparkle",
    points: [
      "Scheduled weekly and monthly digests",
      "Shareable read-only links",
      "Export to PDF or CSV",
    ],
  },
];
