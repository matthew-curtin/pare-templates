import Link from "next/link";
import type { Piece } from "@/content/types";
import type { Reason } from "@/lib/schedule";
import { Footprint } from "./drawing";
import { Initials } from "./bits";
import { kilnById } from "@/content/kilns";
import { boxOf, fromToday } from "@/lib/format";
import { glazeOf, memberOf, trackOf } from "@/lib/studio";

/**
 * One pot on the shelf.
 *
 * Carries its own footprint drawn to scale against Ash, the smallest
 * kiln in the studio — so two tiles anywhere on the site are comparable,
 * and "this will not fit" is visible before it is read.
 *
 * `data-owed` is what the dashed border in globals.css keys off with
 * `:has()`: a piece whose maker has to make a decision before the studio
 * can do anything is not in a queue at all, and it should not look as
 * though it is.
 */
export function PieceTile({ piece, reason }: { piece: Piece; reason: Reason }) {
  const member = memberOf(piece.memberId);
  const glaze = glazeOf(piece.glazeId);
  const track = trackOf(piece.id);
  const ash = kilnById.get("ash");

  return (
    <li
      className="tile min-w-0 border border-line bg-paper"
      style={{ viewTransitionName: `tile-${piece.id}` }}
    >
      <Link
        href={`/pieces/${piece.id}`}
        className="focus-ring flex gap-3 p-3"
        data-owed={reason === "you" ? "you" : undefined}
      >
        {ash ? <Footprint width={piece.width} depth={piece.depth} against={ash} /> : null}
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className="truncate text-[0.9375rem] text-ink">{piece.name}</span>
            <Initials>{member?.initials}</Initials>
          </span>
          <span className="figure mt-1 block text-[0.75rem] text-ink-subtle">
            {boxOf(piece)} · {glaze ? glaze.name : "no glaze chosen"}
          </span>
          <span className="mt-1 block text-[0.8125rem] text-ink-muted">
            {track?.readyOn === null || track === undefined ? (
              <span className="text-cold">No date</span>
            ) : (
              <>Out {fromToday(track.readyOn)}</>
            )}
          </span>
        </span>
      </Link>
    </li>
  );
}
