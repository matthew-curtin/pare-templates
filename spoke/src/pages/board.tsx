import { Link } from "react-router-dom";
import { Band } from "@/components/shell";
import { Figure, Head, Notice, PartLink } from "@/components/bits";
import { Plate } from "@/components/plate";
import { photos } from "@/photos";
import { shots } from "@/content/photos";
import { findings, site } from "@/content/site";
import {
  gaps,
  item,
  orders,
  productViews,
  queue,
  sharedParts,
  supplierOf,
} from "@/lib/shop";
import { TODAY, longDate, shortDate } from "@/lib/calendar";
import { batch, money, priceExact, plural } from "@/lib/format";

/**
 * The board: one question, answered before anything else on the page.
 *
 * Everything here is derived. The only judgement written into this file
 * is the ORDER — how many can we build, then what is stopping more,
 * then what the queue is going to run into, then the three things the
 * arithmetic keeps saying that nobody believes until they see it.
 */
export default function BoardPage() {
  const [kade, vaart] = productViews;
  const top = kade.constraints.slice(0, 5);
  const topTotal = top.reduce((n, c) => n + (item(c.itemId).cost ?? 0), 0);
  const dearest = kade.constraints.find((c) => c.itemId === "hub-rear-gear");
  const nextDue = [...queue].sort((a, b) => a.due - b.due)[0];
  const firstGap = gaps[0];

  return (
    <>
      <Band top>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
          <div className="min-w-0">
            <h1 className="display max-w-[13ch]">{site.claim}</h1>
            <p className="mt-5 max-w-[58ch] text-[1.0625rem] leading-relaxed text-ink-muted">
              {site.lede}
            </p>

            <div className="hair mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t pt-6 sm:grid-cols-4">
              {productViews.map((v) => (
                <Figure
                  key={v.id}
                  value={v.count}
                  label={
                    <>
                      <Link to={`/tree/${v.id}`} className="focus-ring hover:text-ink">
                        {v.item.name}
                      </Link>
                      , from stock
                    </>
                  }
                />
              ))}
              <Figure
                value={gaps.length}
                tone="short"
                label={<>parts the queue runs out of</>}
              />
              <Figure
                value={orders.filter((o) => o.due > TODAY).length}
                tone="inbound"
                label={<>orders on their way</>}
              />
            </div>

            <div className="mt-6 max-w-[70ch]">
              <Notice>
                Those two build numbers cannot both be spent. The bicycles share{" "}
                {sharedParts.length} of their bought parts, so every Kade built out of stock is a
                Vaart not built out of the same stock. The{" "}
                <Link to="/builds" className="focus-ring text-inbound underline underline-offset-2">
                  build queue
                </Link>{" "}
                is where the two are reconciled, and it is the only page here that knows what we
                have actually promised.
              </Notice>
            </div>
          </div>

          <Plate shot={shots.wheel} src={photos.wheel} eager />
        </div>
      </Band>

      <Band tint>
        <Head
          note={`Sorted by how many whole bicycles each part alone would allow. The number at the top of this list is the number at the top of the page — a Kade needs all fifty-eight, so the smallest quotient wins.`}
        >
          What is stopping the {kade.item.name}
        </Head>

        <ul className="grid list-none gap-3 p-0 sm:grid-cols-2 xl:grid-cols-5">
          {top.map((c, n) => {
            const it = item(c.itemId);
            return (
              <li
                key={c.itemId}
                className="min-w-0 border border-line bg-ground p-3 transition-colors duration-[--dur-quick] hover:border-line-strong"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="fig text-[0.6875rem] text-ink-subtle">{n + 1}</span>
                  <span className="fig text-[1.5rem] leading-none">{c.allows}</span>
                </div>
                <h3 className="mt-2 truncate text-[0.9375rem] leading-tight">
                  <PartLink id={c.itemId} name={it.name} />
                </h3>
                <p className="fig mt-1 text-[0.75rem] text-ink-subtle">
                  {priceExact(it.cost ?? 0)} each · {c.per} per bicycle · {c.have} on the shelf
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mt-5 max-w-[74ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          Those five cost <span className="fig">{priceExact(topTotal)}</span> between them, and the
          dearest of the five is a spoke. The{" "}
          <PartLink id="hub-rear-gear" name="hub gear" /> — at{" "}
          <span className="fig">{priceExact(item("hub-rear-gear").cost ?? 0)}</span> the most
          expensive thing we buy — would have let us build{" "}
          <span className="fig">{dearest?.allows}</span>.
        </p>
      </Band>

      <Band>
        <Head
          note={`Cumulative, in due order: the question is never whether one batch can be built but whether it can be built after the ones in front of it. The horizon is ${shortDate(queue[queue.length - 1].due)}.`}
        >
          What the queue runs into
        </Head>

        {gaps.length === 0 ? (
          <Notice>Nothing. Every part in the queue is covered by stock or an arrival.</Notice>
        ) : (
          <ul className="grid list-none gap-4 p-0 lg:grid-cols-3">
            {gaps.map((g) => {
              const it = item(g.itemId);
              const late = g.coveredOn === null ? null : g.coveredOn - g.firstShortAt;
              return (
                <li key={g.itemId} className="min-w-0 border border-line border-l-2 border-l-short bg-short-wash p-4">
                  <h3 className="text-[1.0625rem] leading-tight">
                    <PartLink id={g.itemId} name={it.name} />
                  </h3>
                  <p className="fig mt-1 text-[0.8125rem] text-ink-muted">
                    short {g.short} · wants {g.need} by {shortDate(g.firstShortAt)} · has {g.have}
                  </p>
                  <p className="mt-3 text-[0.875rem] leading-relaxed">
                    {g.coveredOn === null ? (
                      <>
                        <span className="text-short">Nothing is on order.</span> Somebody has to
                        raise one, and {supplierOf(g.itemId)?.name} take{" "}
                        {it.leadDays} days.
                      </>
                    ) : (
                      <>
                        The order lands {shortDate(g.coveredOn)},{" "}
                        <span className="text-short">
                          {plural(late ?? 0, "day")} after it is needed
                        </span>
                        .
                      </>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-6 max-w-[74ch]">
          <Notice tone="inbound">
            The next batch out — {batch(nextDue.qty, item(nextDue.itemId).name)} on{" "}
            {longDate(nextDue.due)} — is not affected by any of these. The first thing that goes
            wrong goes wrong on {longDate(firstGap.firstShortAt)}, which is{" "}
            {firstGap.firstShortAt - TODAY} days away and is why this page exists.
          </Notice>
        </div>
      </Band>

      <Band tint>
        <Head note="Three things the arithmetic keeps saying. None of them is obvious, and the first one is the reason we publish any of this.">
          What the tree keeps telling us
        </Head>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {findings.map((f) => (
            <article key={f.id} className="min-w-0">
              <h3 className="text-[1.0625rem] leading-tight">{f.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{f.body}</p>
            </article>
          ))}
        </div>
      </Band>

      <Band>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
          <Plate shot={shots.shop} src={photos.shop} />
          <div className="min-w-0">
            <h2 className="text-title">Why any of this is public</h2>
            <p className="mt-3 max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              A workshop that will not tell you what is in its bicycle is usually not hiding a
              secret, it is hiding that it does not know. We know, because we have to: nine people
              cannot carry a hundred part numbers in their heads, and the same list that decides
              what gets built this week is the one on this page.
            </p>
            <p className="mt-3 max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              It also means the honest answer to &ldquo;when can I have one&rdquo; is on the site
              rather than in an email. We quote {site.quotedWeeks} weeks and the model says{" "}
              {kade.lead}&ndash;{vaart.lead} days;{" "}
              <Link to="/method" className="focus-ring text-inbound underline underline-offset-2">
                the difference is explained
              </Link>{" "}
              rather than padded.
            </p>
            <p className="fig mt-4 text-[0.8125rem] text-ink-subtle">
              A {kade.item.name} is {money(kade.cost)} of parts and sells for{" "}
              {money(site.retail.kade)}. The difference is nine wages, a building, and the two days
              somebody spends filing a frame.
            </p>
          </div>
        </div>
      </Band>
    </>
  );
}
