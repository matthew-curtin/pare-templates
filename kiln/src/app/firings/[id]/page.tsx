import Link from "next/link";
import { notFound } from "next/navigation";
import { Band } from "@/components/shell";
import { Chip, Initials, Note, Stat } from "@/components/bits";
import { Curve, CurveTable } from "@/components/curve";
import { Elevation, PlanView } from "@/components/drawing";
import { Gauge } from "@/components/gauge";
import { pastFirings } from "@/content/pieces";
import { boxOf, longDate, money, percent, plural } from "@/lib/format";
import {
  costOf,
  firingById,
  firings,
  kilnOf,
  memberOf,
  perPiece,
  pieceOf,
  programOf,
  shareOf,
} from "@/lib/studio";

export function generateStaticParams() {
  return [...firings.map((f) => ({ id: f.id })), ...pastFirings.map((f) => ({ id: f.id }))];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const firing = firingById.get(id) ?? pastFirings.find((f) => f.id === id);
  if (!firing) return { title: "Firing" };
  const kiln = kilnOf(firing.kilnId);
  const program = programOf(firing.programId);
  return {
    title: `${kiln?.name}, ${program?.name.toLowerCase()} — ${longDate(firing.day)}`,
    description: `What is in ${kiln?.name} on ${longDate(firing.day)}, how full it is, and what each piece pays for it.`,
  };
}

/**
 * One firing, opened up.
 *
 * A planned firing gets its elevation and a plan view of every shelf,
 * because the argument only lands when you can see the gaps. A past
 * firing gets its temperature log instead, since what it held is
 * history and how it climbed is the only thing left to look at.
 */
export default async function FiringPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const planned = firingById.get(id);
  const past = pastFirings.find((f) => f.id === id);
  if (!planned && !past) notFound();

  const kilnId = planned?.kilnId ?? past?.kilnId ?? "";
  const programId = planned?.programId ?? past?.programId ?? "";
  const kiln = kilnOf(kilnId);
  const program = programOf(programId);
  if (!kiln || !program) notFound();

  const day = planned?.day ?? past?.day ?? 0;

  return (
    <>
      <Band top>
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <h1 className="display">{kiln.name}</h1>
          <div className="min-w-0">
            <p className="text-lede text-ink">
              {program.name}, cone {program.cone}
            </p>
            <p className="figure text-[0.875rem] text-ink-subtle">{longDate(day)}</p>
          </div>
          {past ? (
            <Chip heat="fire">Fired</Chip>
          ) : planned ? (
            <Chip heat={planned.status === "postponed" ? "cold" : planned.status === "loading" ? "fire" : "quiet"}>
              {planned.status === "postponed"
                ? "Will not light"
                : planned.status === "loading"
                  ? "Being packed"
                  : planned.status === "open"
                    ? "Nothing on it yet"
                    : "Planned"}
            </Chip>
          ) : null}
        </div>

        <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          {program.note}
        </p>
      </Band>

      {planned ? (
        <Band>
          <div className="grid gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start">
            <Elevation kiln={kiln} load={planned.load} />

            <div className="min-w-0">
              <Gauge kiln={kiln} load={planned.load.load} status={planned.status} />

              <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
                <Stat label="In it">{planned.pieces.length}</Stat>
                <Stat label="Turned away" heat={planned.bumped.length > 0 ? "cold" : "quiet"}>
                  {planned.bumped.length}
                </Stat>
                <Stat label="The firing costs">{money(costOf(kiln.id))}</Stat>
                <Stat label="Each piece pays">
                  {perPiece(planned) === null ? "—" : money(perPiece(planned) as number)}
                </Stat>
              </div>

              {planned.status === "postponed" ? (
                <div className="mt-5">
                  <Note heat="cold">
                    {percent(planned.load.load)} of the chamber is spoken for and {kiln.name}{" "}
                    lights at {percent(kiln.minLoad)}. It costs {money(costOf(kiln.id))} to
                    run either way, so it waits for the next one. Nobody in this list has done
                    anything wrong; there are simply not enough of them.
                  </Note>
                </div>
              ) : null}

              <p className="mt-5 max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                {kiln.note}
              </p>
            </div>
          </div>
        </Band>
      ) : null}

      {planned && planned.load.layers.length > 0 ? (
        <Band>
          <h2 className="text-title">Shelf by shelf</h2>
          <p className="mt-2 max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            Seen from above, drawn to the centimetre. The gaps are the real gaps — a 26cm bowl
            and a 22cm bowl do not sit side by side on a 40cm shelf, and there is nothing to
            be done about it except put something smaller there.
          </p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {planned.load.layers.map((layer, i) => (
              <PlanView
                key={i}
                kiln={kiln}
                layer={layer}
                index={i}
                labelOf={(pid) => pieceOf(pid)?.name.split(",")[0] ?? ""}
              />
            ))}
          </div>
        </Band>
      ) : null}

      {planned && planned.pieces.length > 0 ? (
        <Band>
          <h2 className="text-title">What it is carrying</h2>
          <p className="mt-2 max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            Each piece pays for the space it takes rather than an equal share, because a
            division by head count makes a mug subsidise an urn.
          </p>
          <table className="mt-5 w-full min-w-0 border-collapse text-left text-[0.875rem]">
            <thead>
              <tr className="border-b border-line-strong">
                <th scope="col" className="py-2 pr-4 font-normal text-ink-subtle">
                  Piece
                </th>
                <th scope="col" className="py-2 pr-4 font-normal text-ink-subtle">
                  Maker
                </th>
                <th scope="col" className="py-2 pr-4 font-normal text-ink-subtle">
                  Size
                </th>
                <th scope="col" className="py-2 text-right font-normal text-ink-subtle">
                  Its share
                </th>
              </tr>
            </thead>
            <tbody>
              {planned.pieces.map((pid) => {
                const piece = pieceOf(pid);
                if (!piece) return null;
                const member = memberOf(piece.memberId);
                const share = shareOf(planned, pid);
                return (
                  <tr key={pid} className="border-b border-line">
                    <td className="py-2 pr-4">
                      <Link href={`/pieces/${pid}`} className="focus-ring hover:text-fire">
                        {piece.name}
                      </Link>
                    </td>
                    <td className="py-2 pr-4">
                      <span className="flex items-center gap-2 text-ink-muted">
                        <Initials>{member?.initials}</Initials>
                        {member?.name}
                      </span>
                    </td>
                    <td className="figure py-2 pr-4 text-ink-muted">{boxOf(piece)}</td>
                    <td className="figure py-2 text-right">
                      {share === null ? "—" : money(share)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Band>
      ) : null}

      {planned && planned.bumped.length > 0 ? (
        <Band>
          <h2 className="text-title">Turned away</h2>
          <p className="mt-2 max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            Offered to this kiln and did not fit. They go to the front of the next load of the
            same programme, which is the studio&rsquo;s only fairness rule.
          </p>
          <ul className="mt-4 flex list-none flex-wrap gap-x-4 gap-y-2 p-0 text-[0.9375rem]">
            {planned.bumped.map((pid) => {
              const piece = pieceOf(pid);
              return piece ? (
                <li key={pid}>
                  <Link href={`/pieces/${pid}`} className="focus-ring text-ink-muted hover:text-ink">
                    {piece.name}{" "}
                    <span className="figure text-[0.8125rem] text-ink-subtle">{boxOf(piece)}</span>
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </Band>
      ) : null}

      {past ? (
        <Band>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
            <div className="min-w-0">
              <h2 className="text-title">How it climbed</h2>
              <p className="mt-2 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                {plural(past.total, "piece")} went in and {past.loaded.length} of them are
                still on the books; the rest have been taken home. It cost{" "}
                {money(costOf(kiln.id))} to run, which is {money(costOf(kiln.id) / past.total)}{" "}
                a piece.
              </p>
              {past.note ? (
                <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                  {past.note}
                </p>
              ) : null}
              <div className="mt-5">
                <Curve firing={past} program={program} />
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="text-title">The log</h2>
              <div className="mt-3">
                <CurveTable firing={past} />
              </div>
            </div>
          </div>

          {past.loaded.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-title">Still in the building</h2>
              <ul className="mt-3 flex list-none flex-wrap gap-x-4 gap-y-2 p-0 text-[0.9375rem]">
                {past.loaded.map((pid) => {
                  const piece = pieceOf(pid);
                  return piece ? (
                    <li key={pid}>
                      <Link
                        href={`/pieces/${pid}`}
                        className="focus-ring text-ink-muted hover:text-ink"
                      >
                        {piece.name}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          ) : null}
        </Band>
      ) : null}
    </>
  );
}
