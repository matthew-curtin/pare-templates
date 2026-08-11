/**
 * Every template has a picture, and Pare can actually load it.
 *
 *   node scripts/check-thumbnails.mjs
 *
 * This exists because of how the failure presents. Pare's template picker
 * treats a missing thumbnail as a NORMAL state — the card falls back to a
 * route sketch and says nothing, deliberately, so that a broken image can
 * never take the picker down. The cost of that design is that every way of
 * getting this wrong is silent: a template added without running
 * `shoot-fleet.mjs`, a manifest entry left at `null`, a renamed template
 * whose old image lingers, a path Pare's whitelist quietly refuses. None of
 * them error anywhere. You just never see the picture, and you assume the
 * feature is broken rather than the data.
 *
 * So the rule is asserted here instead: a manifest entry and its image agree,
 * or this fails.
 *
 * The whitelist check is the subtle one. Pare pins the manifest's `thumbnail`
 * field to lowercase path segments with a single extension, because that
 * string becomes a URL on the other side. A path this repo considers fine and
 * that regex refuses produces exactly the silent nothing described above — so
 * the shape is enforced at the source rather than discovered in the app.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const thumbsDir = path.join(root, "thumbnails");

/** Mirrors SAFE_THUMB in Pare's `src/main/templates.ts`. A path that fails
 *  this is dropped there with a console warning nobody is reading. */
const SAFE_THUMB = /^[a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9-]*)*\.(jpg|jpeg|png|webp)$/;

/** A 1280×800 JPEG of a website lands around 60–120KB. Ten times that is
 *  somebody committing a PNG or an un-resized original by hand. */
const MAX_BYTES = 900_000;

const problems = [];
const manifest = JSON.parse(readFileSync(path.join(root, "manifest.json"), "utf8"));
const expected = new Set();

for (const t of manifest.templates) {
  const want = `thumbnails/${t.id}.jpg`;

  if (!t.thumbnail) {
    problems.push(`${t.id}: manifest has no thumbnail — run \`node scripts/shoot-fleet.mjs ${t.id}\` and set it to "${want}"`);
    continue;
  }

  // One convention, so the generator and the manifest cannot drift apart.
  if (t.thumbnail !== want) {
    problems.push(`${t.id}: thumbnail is "${t.thumbnail}", expected "${want}"`);
  }

  if (!SAFE_THUMB.test(t.thumbnail)) {
    problems.push(
      `${t.id}: thumbnail "${t.thumbnail}" is refused by Pare's whitelist — it would silently show no picture`,
    );
  }

  const file = path.join(root, t.thumbnail);
  if (!existsSync(file)) {
    problems.push(`${t.id}: thumbnail "${t.thumbnail}" is not in this repo`);
    continue;
  }

  expected.add(path.basename(t.thumbnail));
  const bytes = statSync(file).size;
  if (bytes > MAX_BYTES) {
    problems.push(
      `${t.id}: thumbnail is ${(bytes / 1024).toFixed(0)}KB, over the ${MAX_BYTES / 1024}KB budget`,
    );
  }
  if (bytes === 0) {
    problems.push(`${t.id}: thumbnail is empty`);
  }
}

// An orphan is a template that was renamed or removed. Harmless to Pare — it
// only ever fetches paths the manifest names — but it is a stale file that
// will be believed the next time somebody looks for one.
if (existsSync(thumbsDir)) {
  for (const entry of readdirSync(thumbsDir)) {
    if (entry.startsWith(".")) continue;
    if (!expected.has(entry)) {
      problems.push(`thumbnails/${entry} belongs to no template in the manifest`);
    }
  }
}

if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? "" : "s"}:\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error("");
  process.exit(1);
}

console.log(`\n${manifest.templates.length} templates, ${manifest.templates.length} thumbnails, all present and loadable\n`);
