import type { ChangelogEntry } from "./types";

/** Newest first. The changelog page renders these in order. */
export const changelog: ChangelogEntry[] = [
  {
    version: "3.4",
    date: "2026-07-22",
    title: "Reviewer load balancing",
    summary:
      "See how review work is distributed across a team, and get a nudge when it concentrates on one or two people.",
    tag: "feature",
    changes: [
      "New reviewer distribution chart on the team dashboard",
      "Optional Slack nudge when one reviewer handles more than 40% of a week's changes",
      "Reviewer data is now included in CSV exports",
    ],
  },
  {
    version: "3.3",
    date: "2026-07-08",
    title: "Faster first sync",
    summary:
      "Connecting a large repository now takes minutes rather than most of an afternoon.",
    tag: "improvement",
    changes: [
      "Historical import runs in parallel across repositories",
      "Progress is shown per repository instead of as a single bar",
      "Reduced memory use on repositories with more than 100k commits",
    ],
  },
  {
    version: "3.2",
    date: "2026-06-19",
    title: "Bitbucket support",
    summary:
      "Bitbucket Cloud joins GitHub and GitLab as a first-class source.",
    tag: "feature",
    changes: [
      "Connect Bitbucket Cloud workspaces from Settings → Integrations",
      "Pull request and review events map to the same metrics as other providers",
      "Bitbucket Server support is in private beta",
    ],
  },
  {
    version: "3.1",
    date: "2026-06-02",
    title: "Digest editing",
    summary:
      "Weekly digests can now be edited before they send, so the summary sounds like your team.",
    tag: "improvement",
    changes: [
      "Digests are held for review for two hours before delivery",
      "Anyone with editor access can revise the draft",
      "Added an option to send immediately and skip the hold",
    ],
  },
  {
    version: "3.0.4",
    date: "2026-05-21",
    title: "Timezone fixes",
    summary: "Several corrections to how weeks are bucketed for distributed teams.",
    tag: "fix",
    changes: [
      "Weeks now start in the workspace timezone rather than UTC",
      "Fixed an off-by-one on cycle time for changes merged near midnight",
      "Corrected daylight saving handling in scheduled digests",
    ],
  },
  {
    version: "3.0",
    date: "2026-05-05",
    title: "Cadence 3.0",
    summary:
      "A rebuilt dashboard, a new flow model, and reports that read like prose.",
    tag: "feature",
    changes: [
      "Rebuilt dashboard with per-stage cycle time",
      "New plain-language weekly report",
      "Team-level reporting is now the default everywhere",
      "Refreshed design across the whole product",
    ],
  },
];
