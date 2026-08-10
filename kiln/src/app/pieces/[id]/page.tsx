import Link from "next/link";
import { notFound } from "next/navigation";
import { Band } from "@/components/shell";
import { Chip, Initials, Note, Stat } from "@/components/bits";
import { Footprint } from "@/components/drawing";
import { kilnById, kilns } from "@/content/kilns";
import { pieces } from "@/content/pieces";
import { TODAY } from "@/content/site";
import { REASON_LABEL, REASON_NOTE } from "@/lib/reasons";
import { dryingDays, dryOn, studioCeiling } from "@/lib/schedule";
import { boxOf, cm, days, fromToday, longDate, money, plural } from "@/lib/format";
import { tallestPossible } from "@/lib/pack";
import {
  firingById,
  glazeOf,
  historyOf,
  kilnOf,
  memberOf,
  pieceOf,
  programOf,
  shareOf,
  trackOf,
} from "@/lib/studio";

export function generateStaticParams() {
  return pieces.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const piece = pieceOf(id);
  if (!piece) return { title: "Piece" };
  const member = memberOf(piece.memberId);
  return {
    title: `${piece.name} — ${member?.name}`,
    description: `Where ${piece.name} is, when it comes out, and what is actually holding it up.`,
  };
}

const STATE_WORD: Record<string, string> = {
  greenware: "Wet clay",
  bisqued: "Bisqued",
  glazed: "Glazed, waiting",
  collected: "Gone home",
};

/**
 * One pot, and the whole of its answer.
 *
 * The rule this page follows: never give a date without the reason, and
 * never give the reason without what would change it. A member who is
 * told "the 8th of June" and nothing else has been given a number to be
 * annoyed by; a member who is told which kiln, how full it is and what
 * it is waiting for has been given the studio.
 */
export default async function PiecePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const piece = pieceOf(id);
  if (!piece) notFound();

  const member = memberOf(piece.memberId);
  const glaze = glazeOf(piece.glazeId);
  const track = trackOf(piece.id);
  const past = historyOf(piece.id);
  const ash = kilnById.get("ash");
  const ceiling = studioCeiling(kilns);
  const tooTall = piece.height > ceiling;
  const willFit = kilns.filter((k) => piece.height <= tallestPossible(k));

  return (
    <>
      <Band top>
        <div className="flex flex-wrap items-start gap-x-6 gap-y-4">
          {ash ? <Footprint width={piece.width} depth={piece.depth} against={ash} /> : null}
          <div className="min-w-0">
            <h1 className="display max-w-[16ch]">{piece.name}</h1>
            <p className="figure mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9375rem] text-ink-muted">
              <span className="inline-flex items-center gap-2">
                <Initials>{member?.initials}</Initials>
                {member?.name}
              </span>
              <span>·</span>
              <span>{boxOf(piece)}</span>
              <span>·</span>
              <span>{piece.method}</span>
            </p>
          </div>
          <Chip heat={track?.readyOn == null ? "cold" : "quiet"}>
            {STATE_WORD[piece.state] ?? piece.state}
          </Chip>
        </div>

        {piece.note ? (
          <p className="mt-5 max-w-[62ch] text-lede leading-relaxed text-ink-muted">{piece.note}</p>
        ) : null}
      </Band>

      <Band>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
          <div className="min-w-0">
            <h2 className="text-title">
              {track?.readyOn == null
                ? "No date"
                : `Ready ${fromToday(track.readyOn)}`}
            </h2>
            {track?.readyOn != null ? (
              <p className="figure mt-1 text-[0.9375rem] text-ink-subtle">
                {longDate(track.readyOn)} · {days(track.readyOn - TODAY)} from today
              </p>
            ) : null}

            {track ? (
              <>
                <div className="mt-5">
                  <Chip heat={track.reason === "next" ? "fire" : track.readyOn == null ? "cold" : "quiet"}>
                    {REASON_LABEL[track.reason]}
                  </Chip>
                </div>
                <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                  {REASON_NOTE[track.reason]}
                </p>
              </>
            ) : null}

            {piece.state === "greenware" ? (
              <div className="mt-5">
                <Note>
                  Drying takes {days(dryingDays(piece))} for something {cm(piece.height)} tall —
                  five days for anything, and another for every 12cm. This one is dry on{" "}
                  {longDate(dryOn(piece))}
                  {dryOn(piece) > TODAY ? ", so it cannot go anywhere before then" : ""}.
                </Note>
              </div>
            ) : null}

            {tooTall ? (
              <div className="mt-5">
                <Note heat="cold">
                  At {cm(piece.height)} it is taller than the inside of every kiln in the
                  building. The tallest thing Marlpit can fire is {cm(ceiling)}, in{" "}
                  {kilns.find((k) => tallestPossible(k) === ceiling)?.name}, and that is a
                  fact about the building rather than about the queue.
                </Note>
              </div>
            ) : (
              <div className="mt-5">
                <Note>
                  {willFit.length === kilns.length
                    ? "Every kiln in the studio will take it."
                    : `Only ${willFit.map((k) => k.name).join(" and ")} ${
                        willFit.length === 1 ? "is" : "are"
                      } tall enough for it — ${cm(piece.height)} against ${willFit
                        .map((k) => `${k.name}'s ${cm(tallestPossible(k))}`)
                        .join(" and ")}.`}
                </Note>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-title">Its route</h2>
            <ol className="mt-4 flex list-none flex-col gap-0 p-0">
              <Step label="Made" detail={longDate(piece.madeOn)} done />
              {piece.state === "greenware" ? (
                <Step
                  label="Dry"
                  detail={longDate(dryOn(piece))}
                  done={dryOn(piece) <= TODAY}
                />
              ) : null}
              {past.map((f) => {
                const kiln = kilnOf(f.kilnId);
                const program = programOf(f.programId);
                return (
                  <Step
                    key={f.id}
                    label={`${program?.name} in ${kiln?.name}`}
                    detail={
                      <Link href={`/firings/${f.id}`} className="focus-ring hover:text-fire">
                        {longDate(f.day)}
                      </Link>
                    }
                    done
                  />
                );
              })}
              {track?.steps.map((s) => {
                const kiln = kilnOf(s.kilnId);
                const program = programOf(s.programId);
                const firing = firingById.get(s.firingId);
                const share = firing ? shareOf(firing, piece.id) : null;
                return (
                  <Step
                    key={s.firingId}
                    label={`${program?.name} in ${kiln?.name}`}
                    detail={
                      <>
                        <Link
                          href={`/firings/${s.firingId}`}
                          className="focus-ring hover:text-fire"
                        >
                          {longDate(s.day)}
                        </Link>
                        {share !== null ? (
                          <span className="text-ink-subtle"> · pays {money(share)}</span>
                        ) : null}
                      </>
                    }
                  />
                );
              })}
              {track?.readyOn != null ? (
                <Step label="Off the shelf" detail={longDate(track.readyOn)} />
              ) : null}
            </ol>

            {track && (track.stalled.length > 0 || track.bumped.length > 0) ? (
              <div className="mt-6 border border-line bg-paper p-4">
                <h3 className="text-[1.0625rem] leading-tight">What it has already missed</h3>
                {/* One list in DAY order, not two lists by kind. Rendering
                    the stalls and then the bumps put the 22nd of June above
                    the 8th of June on the first pot that had both, which
                    reads as broken data — and this is a page about time. */}
                <ul className="mt-2 flex list-none flex-col gap-1 p-0 text-[0.875rem] text-ink-muted">
                  {[
                    ...track.stalled.map((fid) => ({ fid, why: "did not light" })),
                    ...track.bumped.map((fid) => ({ fid, why: "filled up first" })),
                  ]
                    .map((m) => ({ ...m, firing: firingById.get(m.fid) }))
                    .filter((m) => m.firing !== undefined)
                    .sort((a, b) => (a.firing?.day ?? 0) - (b.firing?.day ?? 0))
                    .map(({ fid, why, firing }) => (
                      <li key={fid}>
                        <Link href={`/firings/${fid}`} className="focus-ring hover:text-ink">
                          {kilnOf(firing?.kilnId ?? "")?.name}, {longDate(firing?.day ?? 0)}
                        </Link>{" "}
                        — {why}
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </Band>

      <Band>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Glaze" note={glaze ? glaze.behaviour : "Nobody has chosen one yet"}>
            {glaze ? (
              <Link href="/glazes" className="focus-ring hover:text-fire">
                {glaze.name}
              </Link>
            ) : (
              <span className="text-cold">None</span>
            )}
          </Stat>
          <Stat label="Bounding box" note="what a loader measures">
            {boxOf(piece)}
          </Stat>
          <Stat label="Footprint" note="of a shelf in Ash">
            {ash
              ? `${Math.round(((piece.width * piece.depth) / (ash.width * ash.depth)) * 100)}%`
              : "—"}
          </Stat>
          <Stat
            label="Firings left"
            note={
              piece.state === "greenware"
                ? "a bisque, then a glaze firing"
                : piece.state === "collected"
                  ? "it is finished"
                  : "the glaze firing; the bisque is done"
            }
          >
            {piece.state === "collected" ? "None" : piece.state === "greenware" ? "2" : "1"}
          </Stat>
        </div>
      </Band>
    </>
  );
}

function Step({
  label,
  detail,
  done = false,
}: {
  label: string;
  detail: React.ReactNode;
  done?: boolean;
}) {
  return (
    <li className="flex items-baseline gap-3 border-b border-line py-2 last:border-b-0">
      <span
        aria-hidden
        className={`mt-1 h-2 w-2 shrink-0 border ${
          done ? "border-fire bg-fire" : "border-line-strong bg-paper"
        }`}
      />
      <span className="min-w-0 flex-1 text-[0.9375rem] text-ink">{label}</span>
      <span className="figure text-[0.8125rem] text-ink-muted">{detail}</span>
    </li>
  );
}
