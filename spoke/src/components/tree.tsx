import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { childrenOf, leadTime, qtyIn, rolledCost, type Line } from "@/lib/bom";
import { ix, item, slackOf, stateOf } from "@/lib/shop";
import { money, priceExact, qty as fmtQty } from "@/lib/format";
import { KindMark, StateDot } from "./bits";

/**
 * The tree, which is the page rather than a control on it.
 *
 * Rendered RECURSIVELY rather than as a flat list of pre-computed rows,
 * and that is load-bearing: `:has()` propagates a shortage from a leaf
 * up to every assembly containing it, and a selector can only do that
 * if the ancestors are genuinely ancestors in the DOM. A flat list with
 * a depth attribute — which is the obvious way to render a tree, and
 * cheaper — would need JavaScript to walk back up and mark them, and
 * would then need to re-walk on every change.
 *
 * Collapsing hides children with `grid-template-rows: 0fr`, never by
 * unmounting them, for the same reason: an unmounted short part stops
 * being visible to `:has()`, so folding a branch would clear the very
 * warning that tells you what is inside it.
 *
 * The figure columns are identical at every depth and the NAME indents
 * inside its own cell, so the numbers form real columns down the page
 * however deep the row is.
 */

const COLS =
  "grid-cols-[minmax(0,1fr)_3.5rem_4rem_5rem_5.5rem_4rem_4rem] gap-x-2";

export type Selection = {
  id: string;
  key: string;
  qtyPer: number;
  depth: number;
};

export function Tree({
  rootId,
  onPoint,
}: {
  rootId: string;
  /** Fires as the pointer or keyboard focus crosses a row. The gutter
   *  follows it; there is no click to make, because "what is this
   *  branch worth" is a question you ask by looking. */
  onPoint: (sel: Selection | null) => void;
}) {
  return (
    <div
      className="min-w-0 [container-type:inline-size] [container-name:tree]"
      onMouseLeave={() => onPoint(null)}
    >
      <HeaderRow />
      <div className="border-t border-line">
        <Branch
          line={{ parent: "", child: rootId, qty: 1 }}
          depth={0}
          qtyPer={1}
          path={rootId}
          onPoint={onPoint}
        />
      </div>
    </div>
  );
}

function HeaderRow() {
  return (
    <div
      className={`fig sticky top-[3.25rem] z-20 grid ${COLS} border-b border-line-strong bg-ground px-2 py-1.5 text-[0.6875rem] text-ink-subtle`}
    >
      <div>Part</div>
      <div className="text-right">Each</div>
      {/* NOT "per bike". This is the quantity down THIS branch, so a
          spoke reads 32 here and 64 on its own page, because the other
          32 are on the rear wheel's row. Labelling it per-bicycle would
          put a number on screen that contradicts the site's own headline
          claim — the almanac lesson (§7b): the column a reader scans has
          to be the column the label describes. */}
      <div className="text-right">Per branch</div>
      <div className="col-unit text-right">Unit</div>
      <div className="text-right">Extended</div>
      <div className="col-lead text-right">Lead</div>
      <div className="col-slack text-right">Slack</div>
    </div>
  );
}

function Branch({
  line,
  depth,
  qtyPer,
  path,
  onPoint,
}: {
  line: Line;
  depth: number;
  qtyPer: number;
  path: string;
  onPoint: (sel: Selection | null) => void;
}) {
  const id = line.child;
  const it = item(id);
  const kids = childrenOf(ix, id);
  const [open, setOpen] = useState(true);
  const state = stateOf(id);

  const unit = it.kind === "bought" ? (it.cost ?? 0) : rolledCost(ix, id);
  const extended = Math.round(unit * qtyPer);
  const lead = leadTime(ix, id);
  const free = slackOf(id);

  const point = () => onPoint({ id, key: path, qtyPer, depth });

  return (
    <div className="branch">
      <div
        className={`node-row grid ${COLS} items-baseline border-b border-line/70 px-2 py-[5px] text-[0.8125rem] transition-colors duration-[--dur-quick] hover:bg-sunk/60 ${
          state === "short" ? "is-short" : state === "inbound" ? "is-inbound" : ""
        }`}
        onMouseEnter={point}
        onFocus={point}
      >
        <div
          className="node-name flex min-w-0 items-baseline gap-1.5"
          style={{ "--indent": `${depth * 18}px` } as React.CSSProperties}
        >
          {kids.length > 0 ? (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={`${open ? "Collapse" : "Expand"} ${it.name}`}
              className="focus-ring -my-0.5 w-3 shrink-0 text-[0.625rem] text-ink-subtle transition-transform duration-[--dur-quick] hover:text-ink"
              style={{ transform: open ? "rotate(90deg)" : "none" }}
            >
              ▸
            </button>
          ) : (
            <KindMark kind={it.kind} />
          )}
          <Link
            to={`/parts/${id}`}
            className="focus-ring truncate hover:underline underline-offset-2"
            title={it.name}
          >
            {it.name}
          </Link>
          {/* Only ever visible on an ancestor of something short, and
              made visible by the selector rather than by this file —
              see `.branch:has(.is-short)` in index.css. */}
          <span
            className="rollup-flag shrink-0"
            title="something under here is short"
          >
            <StateDot state="short" />
          </span>
        </div>

        <div className="fig text-right text-ink-subtle">
          {depth === 0 ? "" : `×${fmtQty(line.qty)}`}
        </div>
        <div className="fig text-right">{depth === 0 ? "" : fmtQty(qtyPer)}</div>
        <div className="col-unit fig text-right text-ink-muted">
          {it.kind === "bought" ? priceExact(unit) : ""}
        </div>
        <div className="fig text-right">{money(extended)}</div>
        <div className="col-lead fig text-right text-ink-muted">{lead}d</div>
        <div
          className={`col-slack fig text-right ${free !== null && free <= 0 ? "text-short" : "text-ink-subtle"}`}
        >
          {depth === 0 ? "" : free === null ? "—" : `${free}d`}
        </div>
      </div>

      {kids.length > 0 ? (
        <div className="children" data-open={open}>
          <div className="children-inner">
            {kids.map((kid, n) => (
              <Branch
                key={`${path}/${kid.child}/${n}`}
                line={kid}
                depth={depth + 1}
                qtyPer={Math.round(qtyPer * kid.qty * 1000) / 1000}
                path={`${path}/${kid.child}/${n}`}
                onPoint={onPoint}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * The sticky gutter: what the branch under the pointer is worth.
 *
 * These are sums over a subtree rather than values on a row, which is
 * the reason this is a separate surface at all — a row can show its own
 * extended cost, but "everything under here" has nowhere on a row to
 * live, and it is the number somebody deciding what to chase actually
 * wants.
 */
export function Gutter({ rootId, selection }: { rootId: string; selection: Selection | null }) {
  const id = selection?.id ?? rootId;
  const qtyPer = selection?.qtyPer ?? 1;
  const it = item(id);

  const stats = useMemo(() => {
    const seen = new Map<string, number>();
    let rows = 0;
    const walk = (node: string, mult: number) => {
      rows += 1;
      const here = item(node);
      if (here.kind === "bought") seen.set(node, (seen.get(node) ?? 0) + mult);
      for (const kid of childrenOf(ix, node)) walk(kid.child, mult * kid.qty);
    };
    walk(id, 1);
    const short = [...seen.keys()].filter((p) => stateOf(p) === "short");
    const inbound = [...seen.keys()].filter((p) => stateOf(p) === "inbound");
    return { rows, distinct: seen.size, short, inbound };
  }, [id]);

  const unit = it.kind === "bought" ? (it.cost ?? 0) : rolledCost(ix, id);
  // Across every route, not just the one under the pointer.
  const total = qtyIn(ix, rootId, id);

  return (
    <aside className="lg:sticky lg:top-[3.25rem] lg:self-start">
      <div className="gutter-panel border border-line bg-sheet p-3">
        <p className="text-[0.6875rem] text-ink-subtle">
          {selection ? "Under the pointer" : "Whole bicycle"}
        </p>
        <h3 className="mt-0.5 text-[1.0625rem] leading-tight">{it.name}</h3>
        {/* Both numbers when they differ, because the difference IS the
            point: a spoke is 32 down this branch and 64 in the bicycle,
            and the second number only exists because the first appears
            twice in the tree. Showing one and calling it the other is
            how the page would contradict its own front page. */}
        <p className="fig mt-0.5 text-[0.75rem] text-ink-subtle">
          {it.kind === "made" ? "made here" : "bought in"}
          {/* The root is the bicycle; "1 on this branch" is true and
              reads as a bug. */}
          {selection ? ` · ${fmtQty(qtyPer)} on this branch` : ""}
          {selection && total !== null && total !== qtyPer ? (
            <>
              {" · "}
              <span className="text-ink-muted">{fmtQty(total)} per bicycle</span>
            </>
          ) : null}
        </p>

        <dl className="hair mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t pt-3 text-[0.8125rem]">
          <Stat label="Parts in it" value={stats.distinct === 0 ? "—" : String(stats.distinct)} />
          <Stat label="Rows" value={String(stats.rows)} />
          <Stat label="One of these" value={money(unit)} />
          <Stat label="Per bicycle" value={money(Math.round(unit * qtyPer))} />
          <Stat label="Lead" value={`${leadTime(ix, id)} days`} />
          <Stat
            label="Slack"
            value={slackOf(id) === null ? "—" : `${slackOf(id)} days`}
            tone={(slackOf(id) ?? 1) <= 0 ? "short" : "ink"}
          />
        </dl>

        {stats.short.length > 0 ? (
          <div className="hair mt-3 border-t pt-3">
            <p className="text-[0.75rem] text-short">
              {stats.short.length === 1 ? "One part short" : `${stats.short.length} parts short`}
            </p>
            <ul className="mt-1 list-none space-y-0.5 p-0 text-[0.8125rem]">
              {stats.short.map((p) => (
                <li key={p}>
                  <Link to={`/parts/${p}`} className="focus-ring hover:underline">
                    {item(p).name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {stats.short.length === 0 && stats.inbound.length > 0 ? (
          <p className="hair mt-3 border-t pt-3 text-[0.75rem] text-inbound">
            {stats.inbound.length} on order, nothing short
          </p>
        ) : null}
      </div>
    </aside>
  );
}

function Stat({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "short";
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.6875rem] text-ink-subtle">{label}</dt>
      <dd className={`fig ${tone === "short" ? "text-short" : ""}`}>{value}</dd>
    </div>
  );
}
