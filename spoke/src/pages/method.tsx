import { Link } from "react-router-dom";
import { Band } from "@/components/shell";
import { Head, Notice, PartLink } from "@/components/bits";
import { Plate } from "@/components/plate";
import { photos } from "@/photos";
import { shots } from "@/content/photos";
import { ix, item, productViews, requirement, sharedParts } from "@/lib/shop";
import { leadTime } from "@/lib/bom";
import { site } from "@/content/site";
import { DAY_ZERO, shortDate } from "@/lib/calendar";
import { plural } from "@/lib/format";

/**
 * How every number on the site is worked out, in words.
 *
 * This page exists because the site's whole claim is that the
 * arithmetic is public — and arithmetic nobody can check is a slogan.
 * The five walks below are the five functions in `src/lib/bom.ts`, in
 * the same order, described so that somebody could disagree with one.
 */
export default function MethodPage() {
  const [kade] = productViews;
  const sumOfLeads = [...requirement(ix, kade.id).keys()].reduce(
    (n, id) => n + (item(id).leadDays ?? 0),
    0,
  );

  return (
    <>
      <Band top>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
          <div className="min-w-0">
            <h1 className="display max-w-[13ch]">How the numbers work</h1>
            <p className="mt-5 max-w-[60ch] text-[1.0625rem] leading-relaxed text-ink-muted">
              Five walks over one graph. Everything on this site is one of them, and the only one
              people usually get wrong is the third.
            </p>
          </div>
          <Plate shot={shots.bins} src={photos.bins} eager />
        </div>
      </Band>

      <Band tint>
        <ol className="grid list-none gap-6 p-0 lg:grid-cols-2 xl:grid-cols-3">
          <Walk
            n={1}
            title="Down, multiplying"
            rule="qty in a bicycle = the product of the quantities along the path"
          >
            A wheelset holds two wheels and a wheel holds thirty-two spokes, so a{" "}
            {kade.item.name} holds sixty-four. That number is written nowhere — the tree stores 2
            and 32 and the multiplication happens on the way down. Writing 64 in a file would be
            the beginning of two numbers that disagree.
          </Walk>

          <Walk
            n={2}
            title="Up, summing"
            rule="cost of an assembly = the sum of its children, times their quantities"
          >
            Plus anything spent at that level which is not a part. Powder coating is the only such
            thing here: it has an invoice and a turnaround but nothing to run out of, so it lives
            in the tree as an operation with no stock against it.
          </Walk>

          <Walk
            n={3}
            title="Up, MAXIMISING"
            rule="lead time = own build days + the longest child, never the sum"
          >
            Add up the lead times of every part in a {kade.item.name} and you get {sumOfLeads}{" "}
            days. The bicycle takes {kade.lead}, because everything is ordered on the same morning
            and waits alongside everything else. A shop that adds them up chases the wrong supplier
            and is surprised when nothing improves.
          </Walk>

          <Walk
            n={4}
            title="Across the leaves"
            rule="buildable = the smallest whole number of bicycles any single part allows"
          >
            Stock divided by how many go in, rounded down, for all{" "}
            {requirement(ix, kade.id).size} bought parts — and then the smallest of those, because
            a bicycle needs all of them. The part holding that minimum is the constraint, and the
            list under it is what the constraint becomes once you have fixed it.
          </Walk>

          <Walk
            n={5}
            title="Backwards from a leaf"
            rule="where used = every route from a finished bicycle down to this part"
          >
            The same tree read the other way. It is what turns &ldquo;we are out of M5 bolts&rdquo;
            into &ldquo;the mudguards, the carrier and the lamp bracket stop, on both
            bicycles&rdquo; — which is a different sentence and needs a different response.
          </Walk>

          <Walk n={6} title="And slack" rule="slack = total lead − (this part's lead + the build days above it)">
            How late a part could be before the bicycle was late. Zero means it is on the critical
            path. Of {requirement(ix, kade.id).size} bought parts exactly one has none, which is the
            most useful thing on this page: it says which supplier is worth ringing, and — the
            larger and more valuable half — which fifty-five are not.
          </Walk>
        </ol>
      </Band>

      <Band>
        <Head>Three things we do not model, and say so</Head>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="min-w-0">
            <h3 className="text-[1.0625rem] leading-tight">No sub-assembly stock</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              A wheel exists because somebody built it that morning; we do not hold six on a rack.
              So &ldquo;buildable&rdquo; counts bought parts only. It is a real policy rather than a
              simplification — and it happens to keep the arithmetic exact, because netting off
              sub-assembly stock double-counts anything two assemblies share.
            </p>
          </div>
          <div className="min-w-0">
            <h3 className="text-[1.0625rem] leading-tight">The two build numbers interfere</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              {productViews.map((v) => `${v.count} ${v.item.name}`).join(" and ")} are both true and
              cannot both be spent — the bicycles share {sharedParts.length} bought parts. The{" "}
              <Link to="/builds" className="focus-ring text-inbound underline underline-offset-2">
                queue
              </Link>{" "}
              is the only page that reconciles them, and it is the one to believe.
            </p>
          </div>
          <div className="min-w-0">
            <h3 className="text-[1.0625rem] leading-tight">No labour in the parts cost</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
              The tree costs materials. The days on each assembly are there to compute dates, not
              money, so nothing on this site pretends to know what an hour of brazing is worth. The
              difference between the parts figure and the price is nine wages and a building.
            </p>
          </div>
        </div>
      </Band>

      <Band tint>
        <Head>Why we quote {site.quotedWeeks} weeks and the model says {kade.lead} days</Head>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
          <div className="min-w-0 max-w-[64ch] space-y-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            <p>
              {kade.lead} days is what it takes if everything is ordered this morning and nothing
              slips. Neither of those is ever true: we order in batches because the accounts have
              minimums, and the{" "}
              <PartLink id="hub-shell-dyn" name="hub shells" /> have been re-promised twice this
              year already.
            </p>
            <p>
              So the quote carries the difference as slack rather than as optimism. When a bicycle
              is going to be late we would rather have said ten weeks and delivered in seven than
              have said seven and rung somebody up. The number is padded and this paragraph is the
              padding, written down.
            </p>
          </div>
          <Notice>
            Every date on this site is counted in whole days from a fixed morning —{" "}
            {shortDate(0)} {DAY_ZERO.year} — so the story reads the same in Auckland as it does
            here. Nothing in the code asks the machine what day it is.
          </Notice>
        </div>
      </Band>

      <Band>
        <Head note="Both bicycles, end to end, so the two chains can be compared. They differ by a day and they end at the same place.">
          The two critical paths
        </Head>

        <div className="grid gap-6 lg:grid-cols-2">
          {productViews.map((v) => (
            <div key={v.id} className="min-w-0 border border-line bg-sheet p-4">
              <h3 className="text-[1.0625rem] leading-tight">
                <Link to={`/tree/${v.id}`} className="focus-ring hover:underline underline-offset-2">
                  {v.item.name}
                </Link>
                <span className="fig ml-2 text-[0.875rem] text-ink-muted">{v.lead} days</span>
              </h3>
              <ol className="fig mt-3 list-none space-y-1 p-0 text-[0.875rem]">
                {v.path.map((step, n) => (
                  <li key={step} className="flex items-baseline justify-between gap-3">
                    <span
                      className="min-w-0 truncate"
                      style={{ paddingInlineStart: `${n * 12}px` }}
                    >
                      {n > 0 ? <span className="text-ink-subtle">└ </span> : null}
                      <PartLink id={step} name={item(step).name} />
                    </span>
                    <span className="shrink-0 text-ink-subtle">
                      {leadTime(ix, step)}d
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-subtle">
                {plural(v.path.length, "link")}, and the last one is{" "}
                {(item(v.path[v.path.length - 1]).leadDays ?? 0)} of the {v.lead} days.
              </p>
            </div>
          ))}
        </div>
      </Band>
    </>
  );
}

function Walk({
  n,
  title,
  rule,
  children,
}: {
  n: number;
  title: string;
  rule: string;
  children: React.ReactNode;
}) {
  return (
    <li className="min-w-0 border border-line bg-ground p-4">
      <span className="fig text-[0.6875rem] text-ink-subtle">{n}</span>
      <h3 className="mt-1 text-[1.0625rem] leading-tight">{title}</h3>
      <p className="fig mt-2 text-[0.8125rem] leading-snug text-ink-muted">{rule}</p>
      <p className="hair mt-3 border-t pt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
        {children}
      </p>
    </li>
  );
}
