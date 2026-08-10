import Link from "next/link";
import { Band } from "@/components/shell";
import { Note } from "@/components/bits";
import { JoinForm } from "@/components/join-form";
import { memberships, site } from "@/content/site";
import { kilns } from "@/content/kilns";
import { money } from "@/lib/format";
import { costOf, recentFirings } from "@/lib/studio";

export const metadata = {
  title: "Join",
  description:
    "Three memberships at Marlpit, and why there is no price list for firing — every piece pays its share of the kiln it went in.",
};

/**
 * Membership.
 *
 * Note what is NOT on this page: a price for firing a pot. There cannot
 * be one that is true. A piece pays its share of the firing it went in,
 * worked out from the space it took, so the same mug costs different
 * amounts in a full kiln and a thin one — and the site would rather show
 * the division than print an average and hope.
 */
export default function JoinPage() {
  const cheapest = recentFirings
    .map((f) => ({ f, each: costOf(f.kilnId) / f.total }))
    .sort((a, b) => a.each - b.each)[0];
  const dearest = recentFirings
    .map((f) => ({ f, each: costOf(f.kilnId) / f.total }))
    .sort((a, b) => b.each - a.each)[0];

  return (
    <>
      <Band top>
        <h1 className="display max-w-[13ch]">Join</h1>
        <p className="mt-5 max-w-[58ch] text-lede leading-relaxed text-ink-muted">
          A key, a metre of shelf, and a rota you can read before you commit to it. Marlpit
          takes ten members and there are two places at the moment.
        </p>
      </Band>

      <Band>
        <ul className="grid list-none gap-5 p-0 lg:grid-cols-3">
          {memberships.map((m) => (
            <li key={m.id} className="min-w-0 border border-line bg-paper p-5">
              <h2 className="text-[1.375rem] leading-tight">{m.name}</h2>
              <p className="figure mt-1 text-[1.0625rem] text-fire">{m.price}</p>
              <p className="figure mt-1 text-[0.8125rem] text-ink-subtle">{m.shelf}</p>
              <ul className="mt-4 flex list-none flex-col gap-2 p-0 text-[0.9375rem] leading-relaxed text-ink-muted">
                {m.lines.map((line) => (
                  <li key={line} className="border-t border-line pt-2">
                    {line}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Band>

      <Band>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="min-w-0">
            <h2 className="text-title">Why there is no price for firing</h2>
            <p className="mt-3 max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              Because there is no number that would be true. A firing costs what it costs —{" "}
              {kilns.map((k) => `${k.name} ${money(costOf(k.id))}`).join(", ")} — and that is
              the same whether the chamber is packed or holding four pots. So each piece pays
              its share of the space it took, and the share depends on who else was in with
              you.
            </p>
            {cheapest && dearest ? (
              <p className="mt-3 max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                Over the last six firings that has run from {money(cheapest.each)} a piece to{" "}
                {money(dearest.each)} a piece. Printing an average would hide the one thing
                worth knowing, which is that a full kiln is cheap and a thin one is not.
              </p>
            ) : null}
            <p className="mt-3 max-w-[58ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              Every firing page does the division in public.{" "}
              <Link href="/firings" className="focus-ring text-fire underline underline-offset-2">
                Look at any of them
              </Link>
              .
            </p>

            <div className="mt-6 max-w-[58ch]">
              <Note>
                What you are actually buying is a share of a rota. Before you decide, read the
                shelf — particularly the pieces with no date on them, which is the honest worst
                case rather than a disclaimer at the bottom of a page.
              </Note>
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="text-title">Ask about a place</h2>
            <JoinForm />
          </div>
        </div>
      </Band>

      <Band>
        <h2 className="text-title">Finding it</h2>
        <p className="figure mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          {site.address}
          <br />
          {site.hours}
        </p>
      </Band>
    </>
  );
}
