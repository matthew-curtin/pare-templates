import type { Priority, Stage } from "@/content/types";

/**
 * The class names that map data to colour.
 *
 * They live here rather than inside components so that a component
 * never contains a colour decision, and so the whole scale can be
 * re-tuned in one place. The colours themselves are in `index.css`;
 * these only choose between them.
 *
 * Note that every one of these is paired with a written label wherever
 * it is used. Colour is the fast cue, never the only one.
 */
export const priorityChip: Record<Priority, string> = {
  urgent: "bg-urgent-soft text-urgent",
  high: "bg-high-soft text-high",
  medium: "bg-medium-soft text-medium",
  low: "bg-low-soft text-low",
};

export const priorityBar: Record<Priority, string> = {
  urgent: "bg-urgent",
  high: "bg-high",
  medium: "bg-medium",
  low: "bg-low",
};

export const priorityLabel: Record<Priority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

/**
 * Roadmap stages are ordered, so they take one hue at increasing
 * strength rather than three unrelated colours.
 */
export const stageFill: Record<Stage, string> = {
  planned: "bg-stage-1",
  building: "bg-stage-2",
  shipped: "bg-stage-3",
};

export const stageText: Record<Stage, string> = {
  planned: "text-ink-muted",
  building: "text-accent",
  shipped: "text-accent",
};

export const stageLabel: Record<Stage, string> = {
  planned: "Planned",
  building: "Building",
  shipped: "Shipped",
};
