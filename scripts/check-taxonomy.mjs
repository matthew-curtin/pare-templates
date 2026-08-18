/**
 * The vocabulary stays small enough to filter on.
 *
 *   node scripts/check-taxonomy.mjs
 *
 * This exists because of how the failure presents — the same shape as
 * `check-thumbnails.mjs`, and just as silent.
 *
 * Pare's template gallery builds its filter rail FROM this manifest: the
 * category checkboxes are the distinct `category` values, and the feature
 * checkboxes are the tags that appear on enough templates to be worth a box.
 * Nothing in Pare hardcodes the vocabulary, which is deliberate — a hardcoded
 * copy would drift from the fleet the first time somebody added a template.
 *
 * The cost of deriving it is that the manifest can quietly make the filter
 * useless. Before this rule the fleet had NINETEEN templates across SIXTEEN
 * categories, thirteen of which had exactly one member. That renders as a
 * column of sixteen checkboxes where ticking almost any one returns a single
 * result — a filter that is technically working and practically pointless.
 * Nothing errors. Nobody notices until they try to browse.
 *
 * So the constraint is asserted here rather than left to judgement: a category
 * is one of a closed set, and each one earns its box by having members.
 *
 * What this does NOT constrain is `tags`. Tags stay free-text because Pare's
 * SEARCH matches against them, and search wants more words, not fewer — the
 * sixteen old category names all survive as tags for exactly that reason, so
 * typing "broadcast" still finds `playout` even though Broadcast is no longer
 * a category. Only the tags that clear MIN_FEATURE_MEMBERS become checkboxes.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/**
 * The closed set. Five buckets, chosen so every template lands in exactly one
 * and none is a category of one.
 *
 * Adding a sixth is a real decision, not a typo — which is the point of this
 * list. If a new template genuinely does not fit, widen this deliberately and
 * make sure the new bucket can reach MIN_CATEGORY_MEMBERS.
 */
const CATEGORIES = [
  "Marketing site",
  "Application",
  "Content & publishing",
  "Booking & scheduling",
  "Commerce & listings",
];

/** A bucket with fewer members than this is a bucket not worth a checkbox. */
const MIN_CATEGORY_MEMBERS = 3;

/** Mirrors the rule Pare applies when deriving feature checkboxes. */
const MIN_FEATURE_MEMBERS = 3;

const problems = [];
const notes = [];
const manifest = JSON.parse(readFileSync(path.join(root, "manifest.json"), "utf8"));
const templates = manifest.templates;

// ---- categories ------------------------------------------------------------

const byCategory = new Map(CATEGORIES.map((c) => [c, []]));

for (const t of templates) {
  if (typeof t.category !== "string" || !t.category) {
    problems.push(`${t.id}: has no category`);
    continue;
  }
  if (!byCategory.has(t.category)) {
    problems.push(
      `${t.id}: category "${t.category}" is not one of the ${CATEGORIES.length} allowed — ` +
        `use one of ${CATEGORIES.map((c) => `"${c}"`).join(", ")}, ` +
        `or widen CATEGORIES in this script if it genuinely needs a new bucket`,
    );
    continue;
  }
  byCategory.get(t.category).push(t.id);
}

for (const [category, members] of byCategory) {
  if (members.length === 0) {
    problems.push(`category "${category}" has no templates — drop it from CATEGORIES`);
  } else if (members.length < MIN_CATEGORY_MEMBERS) {
    problems.push(
      `category "${category}" has only ${members.length} template${members.length === 1 ? "" : "s"} ` +
        `(${members.join(", ")}) — a checkbox that returns ${members.length} results is not a filter. ` +
        `Fold it into another bucket or give it more members`,
    );
  }
}

// ---- tags ------------------------------------------------------------------

const tagCounts = new Map();

for (const t of templates) {
  const tags = Array.isArray(t.tags) ? t.tags : [];
  if (tags.length === 0) {
    problems.push(`${t.id}: has no tags — search has nothing but name and description to match on`);
  }
  const seen = new Set();
  for (const tag of tags) {
    if (typeof tag !== "string" || !tag) {
      problems.push(`${t.id}: has an empty tag`);
      continue;
    }
    // Pare lowercases both sides when it matches, so a capitalised tag is not
    // a search bug — it is an inconsistency that shows up in a checkbox label.
    if (tag !== tag.toLowerCase()) {
      problems.push(`${t.id}: tag "${tag}" is not lowercase`);
    }
    if (seen.has(tag)) {
      problems.push(`${t.id}: tag "${tag}" is listed twice`);
    }
    seen.add(tag);
    tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
}

// A tag that merely restates the category adds a checkbox that duplicates one
// the user already has. Pare drops these when deriving features; this reports
// them so the two stay in agreement about what a feature is.
const categoryWords = new Set(
  CATEGORIES.flatMap((c) => c.toLowerCase().split(/\s*&\s*|\s+/)).filter(Boolean),
);

const features = [...tagCounts.entries()]
  .filter(([tag, n]) => n >= MIN_FEATURE_MEMBERS && !categoryWords.has(tag))
  .sort((a, b) => b[1] - a[1]);

if (features.length === 0) {
  problems.push(
    `no tag appears on ${MIN_FEATURE_MEMBERS}+ templates, so the feature filter would be empty`,
  );
} else {
  notes.push(
    `feature checkboxes Pare will derive: ${features.map(([t, n]) => `${t} (${n})`).join(", ")}`,
  );
}

// ---- report ----------------------------------------------------------------

if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? "" : "s"}:\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error("");
  process.exit(1);
}

console.log(`\n${templates.length} templates across ${CATEGORIES.length} categories:\n`);
for (const [category, members] of byCategory) {
  console.log(`  ${String(members.length).padStart(2)}  ${category}`);
}
console.log("");
for (const n of notes) console.log(`  ${n}`);
console.log(`\n  ${tagCounts.size} distinct tags, all searchable\n`);
