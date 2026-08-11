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
import { auditDebtList } from "./fleet.mjs";

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

/**
 * §6: imagery is the default and omitting it needs an argument.
 *
 * Five of the first seven templates carry photography and the six after
 * them carry none — a cliff nobody decided, produced by six locally
 * reasonable omissions in a row. So a template with no images fails
 * unless it is named here WITH a reason, which makes the decision
 * deliberate and visible instead of accumulating.
 *
 * This list is meant to be annoying to add to. If you are reaching for
 * it, check §6 first — the genuine carve-out is about not putting a real
 * person's face behind an invented quote, and it does not extend to
 * their building, their tools or the thing they make.
 */
const NO_IMAGERY = new Map([
  [
    "docs-site",
    "API documentation. Genuinely nothing to photograph — the images in developer docs are diagrams and code, and both are drawn.",
  ],
]);

/**
 * Owes imagery, predates the rule. Not the same thing as exempt, and
 * kept in a separate list precisely so the two cannot be confused.
 *
 * These four are real debt: an inbox has contacts and attachments, a
 * board has avatars and empty states, a jobs board has workplaces. Each
 * has somewhere a photograph belongs and none of them has one. They are
 * printed as owed rather than failing the run, because a check that is
 * permanently red on main is a check people stop reading — the point is
 * that the list is visible and shrinking, same as LEGACY above.
 */
const IMAGERY_DEBT = new Set([
  "analytics-dashboard",
  "project-tracker",
  "support-inbox",
  "almanac",
]);

const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif)$/i;

/** Build output, not template content. A template that has been built
 *  once otherwise reports twice as many images as it ships. */
const BUILD_OUTPUT = new Set(["dist", "build", "out", ".next"]);

/** Each entry: a name, and a test against the template's whole source. */
const MODERN = [
  ["fluid type (clamp)", (css) => /clamp\(/.test(css)],
  ["text-wrap", (css) => /text-wrap:\s*(balance|pretty)/.test(css)],
  ["container queries", (css) => /@container/.test(css)],
  [":has()", (css) => /:has\(/.test(css)],
  ["oklch + color-mix", (css) => /oklch\(/.test(css) && /color-mix\(/.test(css)],
  // `font-stretch: 87%` IS the wdth axis, and it is the spelling to prefer
  // for a REGISTERED axis — `font-variation-settings` is the low-level
  // escape hatch and MDN steers away from it for exactly these four. A
  // detector naming only the escape hatch misses the correct usage.
  // `font-weight` is deliberately not counted: every template sets it.
  [
    "variable-font axis",
    (css) =>
      /font-variation-settings/.test(css) ||
      /font-stretch:\s*\d/.test(css) ||
      /font-optical-sizing:\s*auto/.test(css),
  ],
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

/** Committed raster images, anywhere in the template. Counted from disk
 *  rather than from markup, because an image referenced but never
 *  committed is the hotlinking §6 rules out. */
function countImages(dir) {
  let n = 0;
  const walk = (p) => {
    for (const entry of readdirSync(p, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      if (entry.isDirectory() && BUILD_OUTPUT.has(entry.name)) continue;
      const full = path.join(p, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (IMAGE_RE.test(entry.name)) n += 1;
    }
  };
  walk(dir);
  return n;
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

  // A transition on a REGISTERED custom property is designed motion by any
  // reasonable reading: `@property` is on §4c's own modern-CSS list, an
  // unregistered custom property cannot be interpolated at all, and this
  // is not something Tailwind's defaults can produce by accident — which
  // is the whole reason a bare `transition` does not count here. Both
  // halves are required, so `transition: background` still does not pass.
  const registered = [...css.matchAll(/@property\s+(--[a-z0-9-]+)/gi)].map((m) => m[1]);
  const transitionsRegistered = registered.some((name) =>
    new RegExp(`transition:[^;}]*${name}\\b`).test(css),
  );

  const hasMotion =
    /@keyframes/.test(css) ||
    /animation-timeline/.test(css) ||
    /@starting-style/.test(css) ||
    /::view-transition/.test(css) ||
    /startViewTransition/.test(src) ||
    transitionsRegistered;

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

  // §6 is tracked SEPARATELY from the §4c problems above, because it is
  // deliberately not grandfathered. The legacy list excuses templates
  // built before the craft directive existed — and five of those seven
  // carry photography already. The imagery cliff is the NEWER ones, so
  // running §6 through the same gate would exempt precisely the
  // templates it exists to catch and check nothing at all.
  const images = countImages(dir);
  const exempt = NO_IMAGERY.get(name);
  const owed = IMAGERY_DEBT.has(name);
  const imageProblem =
    images === 0 && !exempt && !owed
      ? "no committed imagery, and no reason recorded in NO_IMAGERY (§6)"
      : null;

  results.push({
    name,
    legacy,
    used,
    problems,
    architecture,
    images,
    exempt,
    owed,
    imageProblem,
  });
  const failing = [...(legacy ? [] : problems), ...(imageProblem ? [imageProblem] : [])];
  if (failing.length > 0) failures.push({ name, problems: failing });
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

// The debt lists are CLOSED. Both of these are historical — they exist
// because rewriting the first ten at once was the wrong use of a week —
// and a new template quietly joining one is how the cliff §6 describes
// happened in the first place. `scripts/fleet.mjs` holds the reasoning
// and the frozen list; `NO_IMAGERY` is deliberately not audited here,
// because it is an open carve-out that costs a written reason.
const names = results.map((r) => r.name);
const debtProblems = [
  ...auditDebtList("LEGACY", LEGACY, names),
  ...auditDebtList("IMAGERY_DEBT", IMAGERY_DEBT, names),
];
if (debtProblems.length > 0) {
  failures.push({ name: "check-craft.mjs", problems: debtProblems });
}

// The open carve-out earns its place by being argued for. A one-word
// reason is not an argument, and an empty one is the list being used as
// a mute button.
for (const [name, reason] of NO_IMAGERY) {
  if (!names.includes(name)) {
    failures.push({
      name: "check-craft.mjs",
      problems: [`NO_IMAGERY names "${name}", which is not a template in this repo`],
    });
  } else if (reason.length < 60) {
    failures.push({
      name: "check-craft.mjs",
      problems: [`NO_IMAGERY's reason for "${name}" is too short to be a reason`],
    });
  }
}

console.log("\n  Craft audit — CONVENTIONS §4c\n");
for (const r of results) {
  const craftOk = r.legacy || r.problems.length === 0;
  const mark = r.imageProblem ? "✗" : r.legacy ? "·" : craftOk ? "✓" : "✗";
  const imagery = r.exempt
    ? "  — nothing to photograph"
    : r.owed && r.images === 0
      ? "   0 images, OWED"
      : `${String(r.images).padStart(4)} images`;
  console.log(
    `  ${mark} ${r.name.padEnd(22)} ${String(r.used.length).padStart(2)}/${MODERN.length} modern   ${imagery}${r.legacy ? "   (§4c grandfathered)" : ""}`,
  );
  if (r.used.length > 0) console.log(`      ${r.used.join(", ")}`);
  if (r.problems.length > 0 && !r.legacy) {
    for (const p of r.problems) console.log(`      ✗ ${p}`);
  }
  if (r.imageProblem) console.log(`      ✗ ${r.imageProblem}`);
}

console.log("");
if (failures.length === 0) {
  const held = results.filter((r) => r.legacy).length;
  const owing = results.filter((r) => r.owed && r.images === 0).length;
  console.log(
    `  ✓ ${results.length - held} template(s) meet §4c; ${held} grandfathered and still owed.`,
  );
  console.log(
    `    ${owing} template(s) owe imagery under §6 — see IMAGERY_DEBT.\n`,
  );
  process.exit(0);
}
console.log(`  ✗ ${failures.length} problem(s):\n`);
for (const f of failures) {
  for (const p of f.problems) console.log(`   • ${f.name}: ${p}`);
}
console.log("");
process.exit(1);
