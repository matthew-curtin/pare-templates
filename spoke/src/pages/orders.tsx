import { Link } from "react-router-dom";
import { Band } from "@/components/shell";
import { Head, Notice, PartLink } from "@/components/bits";
import { Plate } from "@/components/plate";
import { photos } from "@/photos";
import { shots } from "@/content/photos";
import { gapOf, horizon, item, orders, supplierOf } from "@/lib/shop";
import { suppliers } from "@/content/suppliers";
import { TODAY, longDate, shortDate, weekday } from "@/lib/calendar";
import { money, plural, qty as fmtQty } from "@/lib/format";

/**
 * What is on its way, in the order it lands.
 *
 * By arrival date rather than by supplier or by when it was raised,
 * because the only question anybody asks of this page is "what turns up
 * next" — and the two orders that matter are the two at the bottom,
 * which is a fact the sort makes visible for free.
 */
export default function OrdersPage() {
  const inFlight = [...orders]
    .filter((o) => o.due > TODAY)
    .sort((a, b) => a.due - b.due || a.id.localeCompare(b.id));
  const late = inFlight.filter((o) => o.due > horizon);
  const value = inFlight.reduce((n, o) => n + (item(o.itemId).cost ?? 0) * o.qty, 0);

  return (
    <>
      <Band top>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
          <div className="min-w-0">
            <h1 className="display max-w-[14ch]">On its way</h1>
            <p className="mt-4 max-w-[60ch] text-[1.0625rem] leading-relaxed text-ink-muted">
              {plural(inFlight.length, "purchase order")} outstanding, worth {money(value)}. Sorted
              by the day the supplier has promised rather than the day we raised it, because a lead
              time is an average and a promised date is a person.
            </p>

            <div className="mt-6 max-w-[70ch]">
              {late.length > 0 ? (
                <Notice tone="short">
                  {plural(late.length, "order lands", "orders land")} after the last thing we have
                  promised is due out of the door: {late.map((o) => item(o.itemId).name).join(", ")}
                  , on {longDate(late[0].due)}. That is the whole of the problem on the{" "}
                  <Link to="/" className="focus-ring underline underline-offset-2">
                    board
                  </Link>
                  , written as a delivery note.
                </Notice>
              ) : (
                <Notice tone="inbound">Everything outstanding lands inside the queue.</Notice>
              )}
            </div>
          </div>

          <Plate shot={shots.rack} src={photos.rack} eager />
        </div>
      </Band>

      <Band tint>
        <Head note="Every outstanding order, soonest first. The gap between the day it was raised and the day it is promised is the column that tells you which accounts to plan around.">
          Outstanding
        </Head>

        <div className="min-w-0 overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-[0.8125rem]">
            <thead>
              <tr className="fig border-b border-line-strong text-left text-[0.6875rem] text-ink-subtle">
                <th scope="col" className="py-1.5 pr-3 font-normal">Order</th>
                <th scope="col" className="py-1.5 pr-3 font-normal">Part</th>
                <th scope="col" className="py-1.5 pr-3 font-normal">Account</th>
                <th scope="col" className="py-1.5 pr-3 text-right font-normal">Qty</th>
                <th scope="col" className="py-1.5 pr-3 text-right font-normal">Value</th>
                <th scope="col" className="py-1.5 pr-3 font-normal">Raised</th>
                <th scope="col" className="py-1.5 pr-3 font-normal">Promised</th>
                <th scope="col" className="py-1.5 text-right font-normal">Waiting</th>
              </tr>
            </thead>
            <tbody>
              {inFlight.map((o) => {
                const it = item(o.itemId);
                const gap = gapOf(o.itemId);
                const overdue = o.due > horizon;
                return (
                  <tr
                    key={o.id}
                    className={`border-b border-line/70 transition-colors duration-[--dur-quick] hover:bg-sunk/60 ${
                      overdue ? "bg-short-wash" : ""
                    }`}
                  >
                    <th scope="row" className="fig py-1.5 pr-3 text-left font-normal text-ink-subtle">
                      {o.id}
                    </th>
                    <td className="max-w-[15rem] truncate py-1.5 pr-3">
                      <PartLink id={o.itemId} name={it.name} />
                      {gap ? <span className="ml-2 text-[0.75rem] text-short">short</span> : null}
                    </td>
                    <td className="py-1.5 pr-3 text-ink-muted">
                      <Link
                        to={`/parts?supplier=${o.supplierId}`}
                        className="focus-ring hover:underline underline-offset-2"
                      >
                        {supplierOf(o.itemId)?.name}
                      </Link>
                    </td>
                    <td className="fig py-1.5 pr-3 text-right">{fmtQty(o.qty)}</td>
                    <td className="fig py-1.5 pr-3 text-right text-ink-muted">
                      {money(Math.round((it.cost ?? 0) * o.qty))}
                    </td>
                    <td className="fig py-1.5 pr-3 text-ink-subtle">
                      {plural(TODAY - o.placed, "day")} ago
                    </td>
                    <td className={`fig py-1.5 pr-3 ${overdue ? "text-short" : ""}`}>
                      {weekday(o.due).slice(0, 3)} {shortDate(o.due)}
                    </td>
                    <td className="fig py-1.5 text-right text-ink-muted">
                      {o.due - o.placed}d
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <ul className="mt-6 grid list-none gap-3 p-0 lg:grid-cols-2">
          {inFlight
            .filter((o) => o.note)
            .map((o) => (
              <li key={o.id} className="min-w-0 border border-line bg-ground p-3">
                <p className="fig text-[0.75rem] text-ink-subtle">
                  {o.id} · {item(o.itemId).name}
                </p>
                <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-muted">{o.note}</p>
              </li>
            ))}
        </ul>
      </Band>

      <Band>
        <Head note="What each account is for, and roughly how long it takes. The spread is the point: four days at one end of this list and six and a half weeks at the other, for parts that sit two inches apart on the finished bicycle.">
          The accounts
        </Head>

        <ul className="grid list-none gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">
          {[...suppliers]
            .sort((a, b) => a.typicalLead - b.typicalLead)
            .map((s) => (
              <li key={s.id} className="min-w-0 border border-line bg-sheet p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="text-[1.0625rem] leading-tight">
                    <Link
                      to={`/parts?supplier=${s.id}`}
                      className="focus-ring hover:underline underline-offset-2"
                    >
                      {s.name}
                    </Link>
                  </h3>
                  <span className="fig text-[0.8125rem] text-ink-subtle">
                    {s.typicalLead} days
                  </span>
                </div>
                <p className="fig mt-0.5 text-[0.75rem] text-ink-subtle">{s.place}</p>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">{s.note}</p>
              </li>
            ))}
        </ul>
      </Band>

    </>
  );
}
