/**
 * §6, enforced.
 *
 *   node scripts/check-imagery.mjs
 *
 * The rule is that imagery is art-directed rather than merely present:
 * consistent within a template, and doing narrative work. Most of that
 * is a human judgement. This checks the parts that are not.
 *
 * WHAT IT DELIBERATELY DOES NOT MEASURE: the colour of the source
 * files. That was the first design and it was wrong. Consistency here
 * is achieved by a single CSS treatment applied to every photograph, so
 * the sources are SUPPOSED to disagree — five images shot in five
 * buildings under five different white balances are the input, and one
 * `filter` is what makes them a set. A checker measuring source colour
 * would fail the template precisely because its method works.
 *
 * So it measures the MECHANISM instead: that a treatment is declared,
 * that every photograph goes through the one component carrying it, and
 * that nothing ships uncredited or without alt text. Those are
 * properties of the code's shape, which is exactly the kind of thing
 * that stays true when nobody is looking.
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { auditDebtList } from "./fleet.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif)$/i;

/** About 1MB per template, per §6. A little slack over it, because the
 *  number is a budget rather than a limit and one hero image at a
 *  sensible width should not fail a run. */
const WEIGHT_BUDGET = 1_400_000;

/** Nobody needs a 4000px source in a template. A file this wide is
 *  almost always an un-resized original somebody dragged in. */
const MAX_WIDTH_HINT = 2200;

/**
 * Carry photography, predate the treatment rule.
 *
 * These five were art-directed by sourcing alone — which is a real
 * method and it worked for them, because each set was shot for one
 * subject. It is just not a method that SURVIVES: the sixth image
 * somebody adds in a hurry has nothing holding it to the other five.
 * Recorded as owed rather than failing the run, same as the other two
 * lists in this repo; the point is that it is visible and shrinking.
 */
/**
 * Findings that are real, pre-date the rule, and have been looked at
 * and consciously accepted. Keyed by template; each entry is a
 * substring of the problem it forgives, plus why.
 *
 * This is not a mute button. Every entry names something somebody
 * examined and decided about, and it is printed on every run. An entry
 * with a weak reason is an invitation to go and fix the thing.
 */
const ACCEPTED = new Map([
  [
    "editorial-magazine",
    [
      [
        "over the ~1MB budget",
        "15 photographs at 1.55MB. Real, and pre-dates the budget line; re-encoding a shipped set is its own job.",
      ],
      [
        "empty alt on a photograph in cover-mockup.tsx",
        "It is a magazine COVER: the headline is typeset over the photograph in the same component, so an empty alt avoids reading the same thing twice. Defensible, and deliberately not changed by a pass that was about something else.",
      ],
    ],
  ],
]);

const TREATMENT_DEBT = new Set([
  "saas-product-site",
  "mobile-app-landing",
  "editorial-magazine",
  "coffee-storefront",
  "restaurant-booking",
]);

function templates() {
  return readdirSync(root)
    .filter((n) => !n.startsWith(".") && n !== "scripts" && n !== "node_modules")
    .filter((n) => statSync(path.join(root, n)).isDirectory())
    .filter((n) => existsSync(path.join(root, n, "package.json")))
    .sort();
}

/**
 * Source with its comments removed.
 *
 * The import checks below match a string, and a comment EXPLAINING the
 * rule contains that string — which is how `exposure` first failed this
 * run for a doc comment describing why it does not import the module.
 * A checker that counts imports should count imports. Same lesson as
 * stripping comments before asserting on a config file, arriving from
 * the other direction: there, a comment created a false pass; here, a
 * false failure.
 */
function code(file) {
  return readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function walk(dir, onFile) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, onFile);
    else onFile(full, entry.name);
  }
}

/** JPEG/PNG dimensions from the header. No dependency, and enough for a
 *  sanity check — this is not an image library. */
function dimensions(file) {
  const buf = readFileSync(file);
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buf[i + 1];
      // SOF0..SOF15, excluding the DHT/JPG/DAC markers in that range.
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

const failures = [];
const rows = [];

for (const name of templates()) {
  const dir = path.join(root, name);
  const images = [];
  const sources = [];

  walk(dir, (full, base) => {
    if (IMAGE_RE.test(base)) images.push({ full, base });
    else if (/\.tsx?$/.test(base)) sources.push({ full, base });
  });

  const creditsPath = path.join(dir, "CREDITS.md");
  const credits = existsSync(creditsPath) ? readFileSync(creditsPath, "utf8") : null;
  const problems = [];

  // 1. Every template accounts for its photography, including the ones
  //    that have none — "why not" is the part §6 asks to be written down.
  if (credits === null) {
    problems.push("no CREDITS.md");
  } else if (!/##\s*Photography/i.test(credits)) {
    problems.push("CREDITS.md has no ## Photography section");
  }

  if (images.length > 0) {
    // 2. Nothing ships uncredited. Matching on filename rather than on a
    //    count, so swapping an image without updating the list fails.
    if (credits) {
      const missing = images
        .map((i) => i.base)
        .filter((base) => !credits.includes(base));
      if (missing.length > 0) {
        problems.push(`not named in CREDITS.md: ${missing.join(", ")}`);
      }
    }

    // 3. Weight and sanity.
    const bytes = images.reduce((n, i) => n + statSync(i.full).size, 0);
    if (bytes > WEIGHT_BUDGET) {
      problems.push(
        `${(bytes / 1e6).toFixed(2)}MB of imagery, over the ~1MB budget`,
      );
    }
    const huge = images
      .map((i) => ({ base: i.base, d: dimensions(i.full) }))
      .filter((i) => i.d && i.d.w > MAX_WIDTH_HINT);
    if (huge.length > 0) {
      problems.push(
        `un-resized originals (>${MAX_WIDTH_HINT}px wide): ${huge.map((h) => `${h.base} ${h.d.w}px`).join(", ")}`,
      );
    }

    // 4. Alt text on PHOTOGRAPHS. Scoped to files that actually render
    //    one, because an empty alt is the correct answer for decoration
    //    and the first version of this check flagged a hand-drawn SVG
    //    mockup for being properly marked decorative.
    const emptyAlt = sources.filter((s) => {
      const text = code(s.full);
      return /from\s+["']next\/image["']/.test(text) && /alt=(""|\{""\}|'')/.test(text);
    });
    if (emptyAlt.length > 0) {
      problems.push(`empty alt on a photograph in ${emptyAlt.map((s) => s.base).join(", ")}`);
    }

    // 5. The mechanism. If a template declares a treatment token, every
    //    photograph must go through the single component that applies
    //    it — otherwise the treatment is a suggestion and the set drifts
    //    the first time somebody adds an image in a hurry.
    const css = [];
    walk(dir, (full, base) => {
      if (/\.css$/.test(base)) css.push(readFileSync(full, "utf8"));
    });
    const declaresTreatment = css.some((c) => /--photo-filter/.test(c));
    const owesTreatment = TREATMENT_DEBT.has(name);

    if (!declaresTreatment && !owesTreatment) {
      problems.push(
        "no --photo-filter treatment declared; §6 asks how consistency is achieved",
      );
    } else if (declaresTreatment) {
      const renderers = sources.filter((s) =>
        /from\s+["']next\/image["']/.test(code(s.full)),
      );
      if (renderers.length > 1) {
        problems.push(
          `${renderers.length} files import next/image (${renderers.map((r) => r.base).join(", ")}) — a treated template needs exactly one`,
        );
      }
      const appliesFilter = css.some((c) =>
        /filter:\s*var\(--photo-filter\)/.test(c),
      );
      if (!appliesFilter) {
        problems.push("--photo-filter is declared but never applied");
      }
    }
  }

  const accepted = ACCEPTED.get(name) ?? [];
  const forgiven = [];
  const real = [];
  for (const p of problems) {
    const match = accepted.find(([fragment]) => p.includes(fragment));
    if (match) forgiven.push([p, match[1]]);
    else real.push(p);
  }

  rows.push({
    name,
    count: images.length,
    problems: real,
    forgiven,
    owesTreatment: images.length > 0 && TREATMENT_DEBT.has(name),
  });
  if (real.length > 0) failures.push({ name, problems: real });
}

// TREATMENT_DEBT is closed for the same reason check-craft's lists are:
// it records five templates that were art-directed by sourcing alone
// before the treatment rule existed, and a new template joining it
// would be the rule quietly not applying to anything new. The frozen
// fleet and the argument are in scripts/fleet.mjs.
const names = rows.map((r) => r.name);
const debtProblems = [
  ...auditDebtList("TREATMENT_DEBT", TREATMENT_DEBT, names),
  ...auditDebtList("ACCEPTED", ACCEPTED.keys(), names),
];
if (debtProblems.length > 0) {
  failures.push({ name: "check-imagery.mjs", problems: debtProblems });
}

// An accepted finding is a decision somebody made and can be argued
// with. A short reason is not one.
for (const [name, entries] of ACCEPTED) {
  for (const [fragment, why] of entries) {
    if (why.length < 60) {
      failures.push({
        name: "check-imagery.mjs",
        problems: [`ACCEPTED reason for "${name}" / "${fragment}" is too short to be a reason`],
      });
    }
  }
}

console.log("\n  Imagery audit — CONVENTIONS §6\n");
for (const r of rows) {
  const mark = r.problems.length === 0 ? (r.owesTreatment ? "·" : "✓") : "✗";
  const note = r.owesTreatment ? "   sourced-only, treatment OWED" : "";
  console.log(
    `  ${mark} ${r.name.padEnd(22)} ${String(r.count).padStart(2)} images${note}`,
  );
  for (const p of r.problems) console.log(`      ✗ ${p}`);
  for (const [p, why] of r.forgiven) {
    console.log(`      · ${p}`);
    console.log(`        accepted: ${why}`);
  }
}

console.log("");
if (failures.length === 0) {
  console.log(`  ✓ ${rows.length} templates clean\n`);
  process.exit(0);
}
console.log(`  ✗ ${failures.length} template(s) with problems\n`);
process.exit(1);
