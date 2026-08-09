/**
 * The §4c directive, enforced.
 *
 *   node scripts/check-craft.mjs
 *
 * CONVENTIONS §4b says a palette nobody can re-measure is a claim
 * rather than a property, and §4c is the same shape of rule about
 * craft: without something that fails, "give the template a position"
 * decays into a paragraph nobody reads. So this checks the parts that
 * can be checked — the modern-CSS floor, the presence of real motion,
 * reduced-motion coverage, an architecture claimed once, and an
 * art-direction statement that exists.
 *
 * What it deliberately does NOT check is whether the design is any
 * good. Nothing can. The floor exists to force the exploration, and a
 * template can pass every line of this and still be dull.
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/**
 * The first ten templates were measured BEFORE §4c was written and all
 * ten fail it — that measurement is what prompted the rule (no
 * @keyframes, no container queries, no :has(), and six of them sharing
 * one page architecture between them).
 *
 * Rewriting them all at once would be a worse use of a week than making
 * the next ten good, so they are grandfathered rather than exempt: each
 * one still gets audited and printed, it just does not fail the run.
 * Delete a name from this list when its template is brought up to
 * standard — the list going empty is the point of it existing.
 */
const LEGACY = new Set([
  "saas-product-site",
  "mobile-app-landing",
  "editorial-magazine",
  "coffee-storefront",
  "analytics-dashboard",
  "project-tracker",
  "restaurant-booking",
  "docs-site",
  "support-inbox",
  "almanac",
]);

/** Each entry: a name, and a test against the template's whole source. */
const MODERN = [
  ["fluid type (clamp)", (css) => /clamp\(/.test(css)],
  ["text-wrap", (css) => /text-wrap:\s*(balance|pretty)/.test(css)],
  ["container queries", (css) => /@container/.test(css)],
  [":has()", (css) => /:has\(/.test(css)],
  ["oklch + color-mix", (css) => /oklch\(/.test(css) && /color-mix\(/.test(css)],
  ["variable-font axis", (css) => /font-variation-settings/.test(css)],
  ["view transitions", (css, src) => /::view-transition|@view-transition/.test(css) || /startViewTransition/.test(src)],
  ["scroll-driven animation", (css) => /animation-timeline/.test(css)],
  ["@property", (css) => /@property/.test(css)],
];

const MODERN_FLOOR = 4;

function templates() {
  return readdirSync(root)
    .filter((name) => !name.startsWith(".") && name !== "scripts" && name !== "node_modules")
    .filter((name) => statSync(path.join(root, name)).isDirectory())
    .filter((name) => existsSync(path.join(root, name, "package.json")))
    .sort();
}

/** Every stylesheet and every component, concatenated. Reads the source
 *  the template actually ships rather than a built bundle, so this runs
 *  without installing or building anything. */
function readSource(dir) {
  const css = [];
  const src = [];
  const walk = (p) => {
    for (const entry of readdirSync(p, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      const full = path.join(p, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.css$/.test(entry.name)) css.push(readFileSync(full, "utf8"));
      else if (/\.tsx?$/.test(entry.name)) src.push(readFileSync(full, "utf8"));
    }
  };
  walk(path.join(dir, "src"));
  return { css: css.join("\n"), src: src.join("\n") };
}

/** The register in README.md — one architecture per template, claimed once. */
function readRegister() {
  const readme = readFileSync(path.join(root, "README.md"), "utf8");
  const section = readme.split("### Page architecture register")[1] ?? "";
  const rows = new Map();
  for (const line of section.split("\n")) {
    // `[a-z0-9-]+` matches a markdown separator row's dashes too, which
    // registers a template called "---" and fails the run confusingly.
    const m = /^\|\s*([a-z0-9][a-z0-9-]*)\s*\|\s*(.+?)\s*\|\s*$/.exec(line);
    if (m) rows.set(m[1], m[2].replace(/⚠️/g, "").trim());
  }
  return rows;
}

const register = readRegister();
const results = [];
const failures = [];

for (const name of templates()) {
  const dir = path.join(root, name);
  const { css, src } = readSource(dir);


  const used = MODERN.filter(([, test]) => test(css, src)).map(([label]) => label);

  const hasMotion =
    /@keyframes/.test(css) ||
    /animation-timeline/.test(css) ||
    /@starting-style/.test(css) ||
    /::view-transition/.test(css) ||
    /startViewTransition/.test(src);

  const honoursReducedMotion = /prefers-reduced-motion/.test(css);
  const hasMotionTokens = /--dur-|--ease-/.test(css);
  const architecture = register.get(name) ?? null;

  // "Write the art direction down" — the statement lives at the top of
  // the stylesheet. Checking it EXISTS is all a script can do; whether
  // it says anything is a human's job.
  const hasArtDirection = /ART DIRECTION/i.test(css);

  const legacy = LEGACY.has(name);
  const problems = [];
  if (used.length < MODERN_FLOOR) {
    problems.push(`modern-CSS floor: ${used.length} of ${MODERN_FLOOR}`);
  }
  if (!hasMotion) problems.push("no motion of any kind");
  if (hasMotion && !honoursReducedMotion) {
    problems.push("motion without a prefers-reduced-motion block");
  }
  if (hasMotion && !hasMotionTokens) {
    problems.push("motion without --dur-/--ease- tokens");
  }
  if (!hasArtDirection) problems.push("no ART DIRECTION statement in the stylesheet");
  if (!architecture) problems.push("no row in the README architecture register");

  results.push({ name, legacy, used, problems, architecture });
  if (!legacy && problems.length > 0) {
    failures.push({ name, problems });
  }
}

// An architecture claimed twice by two non-legacy templates is the rule
// the register exists for. The grandfathered six share one between them
// on purpose, and are excluded from this rather than from the register.
const claimed = new Map();
for (const r of results) {
  if (r.legacy || !r.architecture) continue;
  const prior = claimed.get(r.architecture);
  if (prior) {
    failures.push({
      name: r.name,
      problems: [`shares an architecture with ${prior}: "${r.architecture}"`],
    });
  } else {
    claimed.set(r.architecture, r.name);
  }
}

const missing = [...register.keys()].filter(
  (name) => !results.some((r) => r.name === name),
);
if (missing.length > 0) {
  failures.push({
    name: "README.md",
    problems: [`register names templates that do not exist: ${missing.join(", ")}`],
  });
}

console.log("\n  Craft audit — CONVENTIONS §4c\n");
for (const r of results) {
  const mark = r.legacy ? "·" : r.problems.length === 0 ? "✓" : "✗";
  console.log(
    `  ${mark} ${r.name.padEnd(22)} ${String(r.used.length).padStart(2)}/${MODERN.length} modern${r.legacy ? "   (grandfathered)" : ""}`,
  );
  if (r.used.length > 0) console.log(`      ${r.used.join(", ")}`);
  if (r.problems.length > 0 && !r.legacy) {
    for (const p of r.problems) console.log(`      ✗ ${p}`);
  }
}

console.log("");
if (failures.length === 0) {
  const held = results.filter((r) => r.legacy).length;
  console.log(
    `  ✓ ${results.length - held} template(s) meet §4c; ${held} grandfathered and still owed.\n`,
  );
  process.exit(0);
}
console.log(`  ✗ ${failures.length} problem(s):\n`);
for (const f of failures) {
  for (const p of f.problems) console.log(`   • ${f.name}: ${p}`);
}
console.log("");
process.exit(1);
