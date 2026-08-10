import { Link } from "react-router-dom";
import { Band } from "@/components/shell";
import { Figure, Head, Notice, PartLink } from "@/components/bits";
import {
  gaps,
  horizon,
  ix,
  item,
  orders,
  queue,
  rolledCost,
  requirement,
  supplierOf,
} from "@/lib/shop";
import { stockOn } from "@/lib/bom";
import { shop } from "@/lib/shop";
import { TODAY, longDate, shortDate } from "@/lib/calendar";
import { batch, money, plural } from "@/lib/format";

/**
 * What we have promised, and whether we can do it.
 *
 * The only page that reconciles the two build numbers on the board.
 * Each batch is checked CUMULATIVELY — against the shelf as it will be
 * on that date, after everything in front of it has been taken — which
 * is why a batch can be fine on its own and impossible in its place.
 */
export default function BuildsPage() {
  const sorted = [...queue].sort((a, b) => a.due - b.due);
  const bikes = queue.reduce((n, c) => n + c.qty, 0);
  const parts = queue.reduce((n, c) => n + rolledCost(ix, c.itemId) * c.qty, 0);

  // Cumulative demand as each batch falls due, and which parts of that
  // batch cannot be met. Walked here rather than in the model because
  // the model reports per PART and this page reports per BATCH.
  const running = new Map<string, number>();
  const rows = sorted.map((c) => {
    const need = requirement(ix, c.itemId);
    const available = stockOn(shop, orders, c.due);
    const missing: { id: string; short: number }[] = [];
    for (const [id, per] of need) {
      const total = (running.get(id) ?? 0) + per * c.qty;
      running.set(id, total);
      const have = available.get(id) ?? 0;
      if (total > have) missing.push({ id, short: Math.round((total - have) * 1000) / 1000 });
    }
    missing.sort((a, b) => b.short - a.short);
    return { commitment: c, missing };
  });

  const firstBad = rows.find((r) => r.missing.length > 0);

  return (
    <>
      <Band top>
        <h1 className="display max-w-[15ch]">What we have promised</h1>
        <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-relaxed text-ink-muted">
          Four batches between now and {shortDate(horizon)}. Each is checked against the shelf as it
          will be on the day it is due — after the batches in front of it have taken what they need,
          and after whatever is on order has landed.
        </p>

        <div className="hair mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t pt-6 sm:grid-cols-4">
          <Figure value={bikes} label="bicycles promised" />
          <Figure value={money(parts)} label="of parts, at today's prices" />
          <Figure
            value={rows.filter((r) => r.missing.length === 0).length}
            label={`of ${rows.length} batches fully covered`}
          />
          <Figure
            value={gaps.length}
            tone="short"
            label="distinct parts short across the queue"
          />
        </div>

        {firstBad ? (
          <div className="mt-6 max-w-[74ch]">
            <Notice tone="short">
              The first two batches are covered. It is{" "}
              {batch(firstBad.commitment.qty, item(firstBad.commitment.itemId).name)} on{" "}
              {longDate(firstBad.commitment.due)} where it stops working — and that batch is short
              of parts that have been on order since before it was agreed.
            </Notice>
          </div>
        ) : null}
      </Band>

      <Band tint>
        <Head note="In due order. The check is cumulative, so a batch inherits everything the ones above it have already taken off the shelf.">
          The queue
        </Head>

        <ol className="list-none space-y-4 p-0">
          {rows.map(({ commitment: c, missing }, n) => {
            const it = item(c.itemId);
            return (
              <li
                key={c.id}
                className={`min-w-0 border border-line border-l-2 p-4 ${
                  missing.length > 0
                    ? "border-l-short bg-short-wash"
                    : "border-l-line-strong bg-ground"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="text-title">
                    {c.qty} × <Link to={`/tree/${c.itemId}`} className="focus-ring hover:underline underline-offset-2">{it.name}</Link>
                  </h3>
                  <p className="fig text-[0.875rem] text-ink-muted">
                    {longDate(c.due)} · {c.due - TODAY} days out ·{" "}
                    {money(rolledCost(ix, c.itemId) * c.qty)} of parts
                  </p>
                </div>

                {c.note ? (
                  <p className="mt-2 max-w-[64ch] text-[0.875rem] leading-relaxed text-ink-muted">
                    {c.note}
                  </p>
                ) : null}

                <div className="hair mt-3 border-t pt-3">
                  {missing.length === 0 ? (
                    <p className="text-[0.875rem] text-ink-muted">
                      Every one of the {requirement(ix, c.itemId).size} parts is on the shelf or
                      lands before this date.
                      {n === 0 ? " Nothing about this batch needs anybody's attention." : ""}
                    </p>
                  ) : (
                    <>
                      <p className="text-[0.875rem] text-short">
                        {plural(missing.length, "part")} short:
                      </p>
                      <ul className="fig mt-2 list-none space-y-1 p-0 text-[0.875rem]">
                        {missing.map((m) => (
                          <li key={m.id} className="flex flex-wrap items-baseline gap-x-2">
                            <PartLink id={m.id} name={item(m.id).name} />
                            <span className="text-short">short {m.short}</span>
                            <span className="text-ink-subtle">
                              · {supplierOf(m.id)?.name} · {item(m.id).leadDays} day lead
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </Band>

      <Band>
        <Head>What we would do about it</Head>
        <div className="grid gap-6 lg:grid-cols-3">
          <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            <strong className="font-[560] text-ink">The bearings are ours to fix.</strong> Nobody
            has raised an order and the lead is ten days, so raising one this morning covers it four
            times over. This is the failure that looks worst on the board and is the least serious
            of the three.
          </p>
          <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            <strong className="font-[560] text-ink">The levers are a phone call.</strong> The order
            exists and lands four days after the batch is due. Four days is a conversation with one
            customer, not a re-plan.
          </p>
          <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            <strong className="font-[560] text-ink">The hub shells are not.</strong> Six and a half
            weeks means the order that covers the batch due on {shortDate(horizon)} should have been
            raised in February, and the one that exists has already been re-promised twice. Either
            the last five bicycles move, or we tell five people. There is no third option and no
            amount of money buys one.
          </p>
        </div>
      </Band>
    </>
  );
}
