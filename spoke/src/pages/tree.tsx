import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Band } from "@/components/shell";
import { Head, Notice } from "@/components/bits";
import { Gutter, Tree, type Selection } from "@/components/tree";
import { item, productViews, viewOf } from "@/lib/shop";
import { money, plural } from "@/lib/format";
import { site } from "@/content/site";

/**
 * The bill of materials, full width.
 *
 * The only page in the fleet whose layout IS its subject: depth is not
 * a control here, it is where things are on the screen.
 */
export default function TreePage() {
  const { productId } = useParams();
  const id = productId ?? productViews[0].id;
  const known = productViews.some((v) => v.id === id);
  const [selection, setSelection] = useState<Selection | null>(null);

  if (!known) return <Navigate to="/tree" replace />;

  const view = viewOf(id);
  const other = productViews.find((v) => v.id !== id);

  return (
    <>
      <Band top>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="min-w-0">
            <h1 className="display max-w-[14ch]">{view.item.name}</h1>
            <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-muted">
              {view.item.note}
            </p>
          </div>

          <nav className="flex shrink-0 gap-1">
            {productViews.map((v) => (
              <Link
                key={v.id}
                to={`/tree/${v.id}`}
                className={`focus-ring rounded-sm border px-3 py-1.5 text-[0.875rem] transition-colors duration-[--dur-quick] ${
                  v.id === id
                    ? "border-line-strong bg-sheet text-ink"
                    : "border-line text-ink-muted hover:text-ink"
                }`}
              >
                {v.item.name}
              </Link>
            ))}
          </nav>
        </div>

        <dl className="fig hair mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-5 sm:grid-cols-3 lg:grid-cols-6">
          <Fact label="Parts in it" value={String(view.boughtCount)} note="bought lines" />
          {/* Rows, not distinct items — a part used in three assemblies
              is three rows, and this number sits a few inches from the
              gutter's own row count. Two numbers on one screen that
              disagree because their labels describe different things is
              the almanac lesson (§7b) arriving from the copy side. */}
          <Fact label="Rows in the tree" value={String(view.rows)} note={`${view.itemCount + 1} distinct items`} />
          <Fact label="Parts cost" value={money(view.cost)} note="materials only" />
          <Fact
            label="Sells for"
            value={money(site.retail[id as keyof typeof site.retail])}
            note="built, tested, delivered"
          />
          <Fact label="Lead time" value={`${view.lead} days`} note="longest chain" />
          <Fact
            label="Buildable today"
            value={String(view.count)}
            note={`from stock, ignoring the ${other?.item.name}`}
          />
        </dl>
      </Band>

      <Band tint>
        <Head note="Quantities are per one of the parent. The per-bicycle column is the model multiplying down the path, which is where sixty-four spokes come from — nobody wrote that number anywhere.">
          The whole tree
        </Head>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
          <Tree rootId={id} onPoint={setSelection} />
          <Gutter rootId={id} selection={selection} />
        </div>
      </Band>

      <Band>
        <Head note="The chain that decides the delivery date. Everything not on it has slack, and most of it has weeks.">
          What sets the date
        </Head>

        <ol className="fig flex list-none flex-wrap items-center gap-x-2 gap-y-2 p-0 text-[0.875rem]">
          {view.path.map((step, n) => (
            <li key={step} className="flex items-center gap-2">
              {n > 0 ? <span className="text-ink-subtle">→</span> : null}
              <Link
                to={`/parts/${step}`}
                className="focus-ring rounded-sm border border-line bg-sheet px-2 py-1 hover:border-line-strong"
              >
                {item(step).name}
              </Link>
            </li>
          ))}
        </ol>

        <p className="mt-5 max-w-[68ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          {plural(view.path.length, "link")}, {view.lead} days. Of the {view.boughtCount} parts we
          buy for a {view.item.name}, {plural(tight(view, 0), "has", "have")} no slack at all,{" "}
          {tight(view, 7) - tight(view, 0)} more are within a week of mattering, and the rest could
          arrive a fortnight late without moving the date by a day.
        </p>

        <div className="mt-5 max-w-[74ch]">
          <Notice>
            Both bicycles have the same part at the end of that chain, and it is also one of the
            three we are short of. That is not a coincidence: a part with a six-and-a-half week lead
            is a part you are always ordering against a forecast, and a forecast is the thing that
            turns out to be wrong.
          </Notice>
        </div>
      </Band>
    </>
  );
}

/** Bought parts whose slack is at or under `days`. Bought only: an
 *  assembly's slack is its children's, and counting both reports the
 *  same constraint twice. */
function tight(view: ReturnType<typeof viewOf>, days: number): number {
  return [...view.slack.entries()].filter(([id, free]) => free <= days && item(id).kind === "bought")
    .length;
}

function Fact({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.6875rem] text-ink-subtle">{label}</dt>
      <dd className="mt-0.5 text-[1.25rem] leading-none">{value}</dd>
      <dd className="mt-1 text-[0.75rem] leading-snug text-ink-subtle">{note}</dd>
    </div>
  );
}
