import type { Cohort, FunnelStage, PlanSlice, Source } from "./types";

/**
 * Where sessions come from. Nominal categories with no natural order,
 * so the chart draws every bar in ONE colour — colouring them by size
 * would encode bar length twice and burn the only free channel.
 */
export const sources: Source[] = [
  { name: "Direct", sessions: 41_820 },
  { name: "Docs", sessions: 28_640 },
  { name: "npm", sessions: 19_275 },
  { name: "Search", sessions: 14_090 },
  { name: "GitHub", sessions: 9_430 },
  { name: "Changelog", sessions: 5_215 },
  { name: "Other", sessions: 3_880 },
];

/**
 * Plan mix, smallest tier first. Three segments on purpose: a fourth
 * would put the palette's yellow beside its orange, which is the one
 * adjacent pair the validator flags. Enterprise lives in the table on
 * the audience page instead of taking a fourth colour here.
 */
export const planMix: PlanSlice[] = [
  { name: "Free", teams: 1_842 },
  { name: "Team", teams: 964 },
  { name: "Business", teams: 311 },
];

/**
 * Weekly retention. `values[0]` is always 1 — everyone is present in
 * the week they arrive — so the first column is drawn but never
 * carries information.
 */
export const cohorts: Cohort[] = [
  { label: "Week of 26 May", size: 214, values: [1, 0.62, 0.51, 0.46, 0.43, 0.41, 0.4, 0.39] },
  { label: "Week of 2 Jun", size: 238, values: [1, 0.64, 0.53, 0.48, 0.45, 0.43, 0.42] },
  { label: "Week of 9 Jun", size: 261, values: [1, 0.66, 0.56, 0.5, 0.47, 0.46] },
  { label: "Week of 16 Jun", size: 249, values: [1, 0.63, 0.52, 0.47, 0.45] },
  { label: "Week of 23 Jun", size: 288, values: [1, 0.69, 0.58, 0.53] },
  { label: "Week of 30 Jun", size: 302, values: [1, 0.58, 0.44] },
  { label: "Week of 7 Jul", size: 275, values: [1, 0.71] },
  { label: "Week of 14 Jul", size: 318, values: [1] },
];

/** The note that explains the one row that breaks the pattern. */
export const cohortNote =
  "The week of 30 June retains worse than its neighbours because it starts the day before the ingest outage — those teams saw a broken product in their first week, and about a third of them did not come back.";

/**
 * Activation funnel. Ordered stages, so this is the one chart that
 * legitimately uses a value ramp: the ordinal blue steps, light to
 * dark. Stages must decrease.
 */
export const funnel: FunnelStage[] = [
  {
    name: "Signed up",
    teams: 3_117,
    detail: "Created a workspace. Nothing installed yet.",
  },
  {
    name: "Key created",
    teams: 2_486,
    detail: "Generated a write key from the setup screen.",
  },
  {
    name: "First event",
    teams: 1_729,
    detail: "We received anything at all from their code.",
  },
  {
    name: "Ten events",
    teams: 1_204,
    detail: "Past the copy-paste example and instrumenting for real.",
  },
  {
    name: "Second week",
    teams: 742,
    detail: "Came back and sent events in the following week.",
  },
];

export const funnelNote =
  "The drop from key created to first event is the one worth fixing: 757 teams generated a key and never sent anything, which usually means the install failed silently rather than that they changed their mind.";
