import { Fragment } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Band } from "@/components/shell";
import { Figure, Head, Notice, StateLabel } from "@/components/bits";
import {
  demand,
  gapOf,
  horizon,
  ix,
  item,
  orders,
  ordersFor,
  productViews,
  slackOf,
  stateOf,
  stockToday,
  supplierOf,
  usesOf,
  shop,
} from "@/lib/shop";
import { leadTime, qtyIn, rolledCost, stockOn } from "@/lib/bom";
import { items } from "@/content/catalogue";
import { TODAY, longDate, shortDate } from "@/lib/calendar";
import { money, priceExact, plural, qty as fmtQty } from "@/lib/format";

/**
 * One part, and the tree INVERTED.
 *
 * The tree page answers "what is in this bicycle". This one answers
 * "where does this end up", which is the same graph walked the other
 * way and is the question a shortage actually raises — a missing bolt
 * is only interesting once you know it holds the mudguards, the carrier
 * and the lamp bracket, on both bicycles.
 */
export default function PartPage() {
  const { partId } = useParams();
  const known = items.some((i) => i.id === partId);
  if (!partId || !known) return <Navigate to="/parts" replace />;

  const it = item(partId);
  const uses = usesOf(partId);
  const state = stateOf(partId);
  const gap = gapOf(partId);
  const supplier = supplierOf(partId);
  const pos = ordersFor(partId);
  const free = slackOf(partId);
  const shelf = stockToday.get(partId);
  const wanted = demand.get(partId) ?? 0;
  // What will be on the shelf by the end of the queue: today's stock
  // plus every arrival between now and then.
  const byHorizon = stockOn(shop, orders, horizon).get(partId) ?? 0;
  const unit = it.kind === "bought" ? (it.cost ?? 0) : rolledCost(ix, partId);

  return (
    <>
      <Band top>
        <p className="text-[0.8125rem] text-ink-subtle">
          <Link to="/parts" className="focus-ring hover:text-ink">
            Parts
          </Link>
          {supplier ? (
            <>
              {" / "}
              <Link
                to={`/parts?supplier=${supplier.id}`}
                className="focus-ring hover:text-ink"
              >
                {supplier.name}
              </Link>
            </>
          ) : null}
        </p>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h1
            className="display max-w-[16ch]"
            style={{ viewTransitionName: "part-name" } as React.CSSProperties}
          >
            {it.name}
          </h1>
          <StateLabel state={state} />
        </div>

        <p className="fig mt-3 text-[0.875rem] text-ink-muted">
          {it.kind === "made" ? "Made here" : "Bought in"} · counted in {it.unit}
          {supplier ? ` · ${supplier.name}, ${supplier.place}` : ""}
        </p>

        {it.note ? (
          <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-muted">
            {it.note}
          </p>
        ) : null}

        <div className="hair mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t pt-6 sm:grid-cols-4 xl:grid-cols-6">
          <Figure value={priceExact(unit)} label={it.kind === "made" ? "in parts" : "each"} />
          {it.kind === "bought" ? (
            <>
              <Figure value={fmtQty(shelf ?? 0)} label="on the shelf" />
              <Figure
                value={fmtQty(wanted)}
                label="wanted by the queue"
                tone={gap ? "short" : "ink"}
              />
              <Figure value={money(Math.round(unit * wanted))} label="that is worth" />
            </>
          ) : (
            <Figure value={String(it.buildDays ?? 0)} label={plural(it.buildDays ?? 0, "day")} />
          )}
          <Figure value={`${leadTime(ix, partId)}d`} label="lead time" />
          <Figure
            value={free === null ? "—" : `${free}d`}
            label="slack before it matters"
            tone={free !== null && free <= 0 ? "short" : "ink"}
          />
        </div>

        {it.kind === "bought" && wanted > 0 ? (
          <div className="hair mt-6 max-w-[38rem] border-t pt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-[0.8125rem] text-ink-subtle">
                What the queue wants, against what will exist by {shortDate(horizon)}
              </p>
              <p className="fig text-[0.8125rem]">
                {fmtQty(byHorizon)} of {fmtQty(wanted)}
              </p>
            </div>
            {/* The one bar on the site. Its fill is a custom property
                registered with @property, so it interpolates rather than
                jumping — which matters because a reader comparing two
                parts moves between pages and the eye follows a bar that
                animates into place. */}
            <div
              className={`gauge mt-2 ${gap ? "text-short" : "text-inbound"}`}
              style={{ "--fill": Math.min(1, byHorizon / wanted) } as React.CSSProperties}
              role="img"
              aria-label={`${Math.round(Math.min(1, byHorizon / wanted) * 100)}% covered`}
            />
          </div>
        ) : null}

        {free !== null && free <= 0 ? (
          <div className="mt-6 max-w-[74ch]">
            <Notice tone="short">
              This part has no slack. Every day it is late is a day both bicycles are late, which is
              true of nothing else we buy — see{" "}
              <Link to="/method" className="focus-ring underline underline-offset-2">
                how slack is worked out
              </Link>
              .
            </Notice>
          </div>
        ) : null}
      </Band>

      {gap ? (
        <Band tint>
          <Head>Short</Head>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start">
            <dl className="fig grid grid-cols-2 gap-x-4 gap-y-3 text-[0.875rem]">
              <Cell label="Short by" value={fmtQty(gap.short)} tone="short" />
              <Cell label="First bites" value={shortDate(gap.firstShortAt)} />
              <Cell label="Wanted by then" value={fmtQty(gap.need)} />
              <Cell label="Will have" value={fmtQty(gap.have)} />
            </dl>
            <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              {gap.coveredOn === null ? (
                <>
                  Nothing is on order. At {supplier?.name}&rsquo;s{" "}
                  {it.leadDays} days, an order raised on the morning of {shortDate(TODAY)} lands{" "}
                  {shortDate(TODAY + (it.leadDays ?? 0))} — which is in time, and stops being in
                  time the longer nobody raises it. This is the only one of the three shortages
                  that is still entirely within our control.
                </>
              ) : (
                <>
                  There is an order, and it lands {longDate(gap.coveredOn)} —{" "}
                  {plural(gap.coveredOn - gap.firstShortAt, "day")} after the build that wants it.
                  Nothing about that gap is fixable by ordering more; it is fixable by moving the
                  build or by moving the promise.
                </>
              )}
            </p>
          </div>
        </Band>
      ) : null}

      <Band>
        <Head
          note={
            uses.length === 0
              ? undefined
              : "Every route from a finished bicycle down to this part. A part in more than one place is counted in each, and the totals at the bottom are the sum."
          }
        >
          Where it ends up
        </Head>

        {uses.length === 0 ? (
          <Notice>
            This is a finished bicycle rather than a part of one, so it ends up nowhere but the
            street.{" "}
            <Link to={`/tree/${partId}`} className="focus-ring text-inbound underline underline-offset-2">
              Its own tree is here
            </Link>
            .
          </Notice>
        ) : (
          <>
            <ul className="list-none space-y-1 p-0">
              {uses.map((u) => (
                <li
                  key={u.path.join("/")}
                  className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 border-b border-line/70 py-1.5 text-[0.875rem]"
                >
                  {u.path.slice(0, -1).map((step, n) => (
                    <Fragment key={`${step}-${n}`}>
                      {n > 0 ? <span className="text-ink-subtle">›</span> : null}
                      <Link
                        to={n === 0 ? `/tree/${step}` : `/parts/${step}`}
                        className="focus-ring hover:underline underline-offset-2"
                      >
                        {item(step).name}
                      </Link>
                    </Fragment>
                  ))}
                  <span className="text-ink-subtle">›</span>
                  <span className="text-ink-muted">{it.name}</span>
                  <span className="fig ml-auto shrink-0 pl-4">{fmtQty(u.qtyPer)}</span>
                </li>
              ))}
            </ul>

            <dl className="fig mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[0.875rem]">
              {productViews.map((v) => {
                const per = qtyIn(ix, v.id, partId);
                return (
                  <div key={v.id} className="flex items-baseline gap-2">
                    <dt className="text-ink-subtle">Per {v.item.name}</dt>
                    <dd>{per === 0 ? "not used" : fmtQty(per)}</dd>
                  </div>
                );
              })}
            </dl>
          </>
        )}
      </Band>

      {pos.length > 0 ? (
        <Band tint>
          <Head note="Placed against a promised date rather than a lead time — which is why one of these says six and a half weeks and another says the same account will be here on Thursday.">
            Orders
          </Head>
          <ul className="grid list-none gap-3 p-0 lg:grid-cols-2">
            {pos.map((o) => (
              <li key={o.id} className="min-w-0 border border-line bg-ground p-3">
                <div className="fig flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[0.875rem]">
                  <span>
                    {o.id} · {fmtQty(o.qty)} {it.unit}
                  </span>
                  <span className={o.due > TODAY ? "text-inbound" : "text-ink-subtle"}>
                    {o.due > TODAY ? `due ${shortDate(o.due)}` : `landed ${shortDate(o.due)}`}
                  </span>
                </div>
                {o.note ? (
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">{o.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Band>
      ) : null}

      {supplier ? (
        <Band>
          <Head>{supplier.name}</Head>
          <p className="max-w-[68ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            {supplier.note}
          </p>
          <p className="fig mt-3 text-[0.8125rem] text-ink-subtle">
            {supplier.place} · usually {supplier.typicalLead} days ·{" "}
            <Link
              to={`/parts?supplier=${supplier.id}`}
              className="focus-ring hover:text-ink"
            >
              everything on this account
            </Link>
          </p>
        </Band>
      ) : null}
    </>
  );
}

function Cell({
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
      <dd className={tone === "short" ? "text-short" : ""}>{value}</dd>
    </div>
  );
}
