/**
 * Photograph the fleet.
 *
 *   node scripts/shoot-fleet.mjs            # every template
 *   node scripts/shoot-fleet.mjs understory # one, by id
 *
 * Boots each template's own dev server, waits for it to stop moving,
 * screenshots the homepage at 1280×800, and writes `thumbnails/<id>.jpg`.
 * The images are COMMITTED. That is deliberate: the fleet is nineteen
 * entries and changes rarely, the alternative is a build step nobody
 * will run, and a missing picture must never be able to break Pare's
 * template picker — which it can't, because the card draws a route
 * sketch when there is no image.
 *
 * Re-runnable and idempotent: run it again and a changed template gets a
 * fresh shot. Pare revalidates each cached image against the file's etag,
 * so re-shooting is all that is needed for the new picture to reach
 * anyone who has already seen the old one.
 *
 * IT USES THE CHROME ALREADY ON THIS MACHINE (`channel: 'chrome'`) rather
 * than downloading Playwright's own build — a ~150MB browser download to
 * take nineteen screenshots is not a trade worth making, and the fleet's
 * templates are ordinary websites that any current Chrome renders the
 * same way. If Chrome is absent the failure says so and the fix is one
 * `npx playwright install chromium` plus deleting the `channel` line.
 *
 * WHAT IT DOES NOT DO: judge the result. A template that boots to an
 * error page produces a screenshot of an error page and this script
 * calls it a success, because "is this a good picture of the site" is
 * not a property code can check. Look at the images before committing
 * them — that is the actual review step, and it is not optional.
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, "thumbnails");

/** A browser viewport, and the aspect the picker's cards are cut to. */
const VIEWPORT = { width: 1280, height: 800 };

/** Quality of the COMMITTED file. Pare re-encodes at 70 when it caches,
 *  so this is the master and wants a little headroom above what ships. */
const JPEG_QUALITY = 82;

/** Cold `next dev` compiles the route on first request, and a few of these
 *  templates are large. Generous, because the cost of being wrong is a
 *  spurious failure on a template that was merely slow. */
const BOOT_TIMEOUT_MS = 120_000;

/** After the network goes quiet: fonts swapping in, entrance animations
 *  finishing, images decoding. Everything that would otherwise be caught
 *  mid-flight. */
const SETTLE_MS = 2_000;

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));

const manifest = JSON.parse(readFileSync(path.join(root, "manifest.json"), "utf8"));
const targets = manifest.templates.filter((t) => only.length === 0 || only.includes(t.id));

if (targets.length === 0) {
  console.error(
    only.length ? `No template matches ${only.join(", ")}` : "The manifest lists no templates",
  );
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

let browser;
try {
  browser = await chromium.launch({ channel: "chrome" });
} catch (err) {
  console.error(
    "\nCould not launch Chrome. Install Google Chrome, or run\n" +
      "  npx playwright install chromium\n" +
      "and remove the `channel: 'chrome'` option above.\n",
  );
  console.error(String(err));
  process.exit(1);
}

const failures = [];
let shot = 0;

for (const [i, template] of targets.entries()) {
  const label = `[${i + 1}/${targets.length}] ${template.id}`;
  const dir = path.join(root, template.path);

  if (!existsSync(path.join(dir, "node_modules"))) {
    console.log(`${label} — SKIPPED, no node_modules (run npm install in ${template.path})`);
    failures.push(`${template.id}: not installed`);
    continue;
  }

  process.stdout.write(`${label} — booting…`);
  let server;
  try {
    server = await bootDevServer(dir, 4300 + i);
  } catch (err) {
    console.log(` FAILED\n    ${String(err.message || err)}`);
    failures.push(`${template.id}: ${err.message || err}`);
    continue;
  }

  try {
    process.stdout.write(` ${server.url} — shooting…`);
    const bytes = await capture(browser, server.url);
    writeFileSync(path.join(outDir, `${template.id}.jpg`), bytes);
    console.log(` ✓ ${(bytes.length / 1024).toFixed(0)}KB`);
    shot++;
  } catch (err) {
    console.log(` FAILED\n    ${String(err.message || err)}`);
    failures.push(`${template.id}: ${err.message || err}`);
  } finally {
    await server.stop();
  }
}

await browser.close();

console.log(`\n${shot}/${targets.length} templates photographed into thumbnails/`);
if (failures.length) {
  console.error(`\n${failures.length} failed:`);
  for (const f of failures) console.error(`  ✗ ${f}`);
}
console.log(
  "\nLook at the images before committing them. A template that boots to an\n" +
    "error page screenshots the error page and this script calls that a pass.\n",
);
process.exit(failures.length === 0 ? 0 : 1);

/**
 * Start `npm run dev` and wait until it announces a URL.
 *
 * The port is passed as a HINT, not a promise — Vite silently moves to the
 * next free port and Next.js does too, so the only trustworthy source of
 * "where is it listening" is what the server itself printed. Same regex
 * Pare's own DevServerManager uses, for the same reason.
 */
function bootDevServer(cwd, port) {
  const URL_REGEX = /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/\S*)?/;
  // eslint-disable-next-line no-control-regex
  const ANSI_REGEX = /\x1B\[[0-9;]*[A-Za-z]/g;

  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", "dev", "--", "--port", String(port)], {
      cwd,
      // Its own process group, so stopping it takes the dev server's own
      // children with it — `npm run dev` is a wrapper and killing only the
      // wrapper leaves the actual server holding the port.
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, BROWSER: "none", FORCE_COLOR: "0" },
    });

    let settled = false;
    let output = "";

    const stop = () =>
      new Promise((done) => {
        if (child.exitCode !== null) return done();
        child.once("exit", () => done());
        try {
          process.kill(-child.pid, "SIGTERM");
        } catch {
          done();
        }
        // A server that ignores SIGTERM must not wedge the whole run.
        setTimeout(() => {
          try {
            process.kill(-child.pid, "SIGKILL");
          } catch {
            /* already gone */
          }
          done();
        }, 4_000).unref();
      });

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      void stop().then(() =>
        reject(new Error(`dev server printed no URL in ${BOOT_TIMEOUT_MS / 1000}s`)),
      );
    }, BOOT_TIMEOUT_MS);

    // STRIP ANSI BEFORE MATCHING. This is not tidiness, it is the whole
    // reason the Vite half of the fleet works.
    //
    // Vite bolds the port number, so what it actually writes is
    // `http://localhost:` ESC[1m `4390` ESC[22m `/`. The escape sits BETWEEN
    // the colon and the digits, and because the port in that regex is
    // optional, the match succeeds early and yields `http://localhost` — a
    // real URL, pointing at port 80, connecting to nothing. All five Vite
    // templates failed with ERR_CONNECTION_REFUSED while all fourteen Next
    // ones passed, which is a very convincing impression of a Vite problem.
    // `FORCE_COLOR=0` does not stop it. Pare's own DevServerManager has
    // carried this same strip, with the same one-line reason, all along.
    //
    // Lines rather than the raw buffer for a second, independent reason: a
    // chunk boundary can land mid-URL, and the same optional port would
    // truncate it the same way.
    let partial = "";
    const onData = (chunk) => {
      const text = chunk.toString("utf8");
      output += text;
      partial += text;
      const lines = partial.split("\n");
      partial = lines.pop() ?? "";
      for (const line of lines) {
        const match = line.replace(ANSI_REGEX, "").match(URL_REGEX);
        if (!match || settled) continue;
        settled = true;
        clearTimeout(timer);
        resolve({ url: match[0].replace(/\/$/, ""), stop });
        return;
      }
    };

    child.stdout.on("data", onData);
    child.stderr.on("data", onData);

    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });

    child.on("exit", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error(`dev server exited (${code}) — ${lastLines(output)}`));
    });
  });
}

async function capture(browser, url) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    // Entrance animations are the single biggest source of a shot caught
    // mid-flight. A template that honours reduced motion lands on its final
    // frame immediately; one that doesn't still gets SETTLE_MS.
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  try {
    // `networkidle` rather than `load`: these are React apps whose content
    // arrives after the document does, and `load` reliably photographs an
    // empty page.
    await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 });
    // Next.js paints a dev-tools badge in the bottom-left corner. It is a
    // property of running in dev, not of the template, and photographing it
    // would put a control the user will never see into every Next thumbnail.
    // `devIndicators: false` in each config would work too, but that edits
    // nineteen templates to fix a problem only this script has.
    await page.addStyleTag({
      content: "nextjs-portal,[data-nextjs-toast],#__next-build-watcher{display:none!important}",
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(SETTLE_MS);
    // Not fullPage — the card is a picture of a browser window, and a
    // full-page shot of a long marketing site is an unreadable ribbon.
    return await page.screenshot({ type: "jpeg", quality: JPEG_QUALITY });
  } finally {
    await context.close();
  }
}

function lastLines(text, n = 3) {
  return (
    text
      .trim()
      .split("\n")
      .slice(-n)
      .join(" / ")
      .slice(0, 300) || "no output"
  );
}
