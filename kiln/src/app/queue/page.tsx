import { Band } from "@/components/shell";
import { Plate } from "@/components/plate";
import { PieceTile } from "@/components/piece-tile";
import { QueueFilter, type Section } from "@/components/queue-filter";
import { photos } from "@/photos";
import { shots } from "@/content/site";
import { REASON_LABEL, REASON_NOTE, REASON_ORDER } from "@/lib/reasons";
import { byReason, onShelf, withoutDate } from "@/lib/studio";

export const metadata = {
  title: "The shelf",
  description:
    "Everything waiting at Marlpit, grouped by what it is actually waiting for rather than by how long it has been there.",
};

/**
 * The shelf: everything that is not finished, grouped by WHY.
 *
 * A queue sorted by how long each thing has waited tells you the order
 * and nothing else. These eight groups are the eight different things
 * that can be true, and they want completely different responses — one
 * of them is a decision the maker owes the studio, one is a fact about
 * the pot, and one is other people not having chosen the same firing.
 */
export default function QueuePage() {
  const sections: Section[] = REASON_ORDER.filter(
    (reason) => (byReason.get(reason) ?? []).length > 0,
  ).map((reason) => {
    const pieces = byReason.get(reason) ?? [];
    return {
      key: reason,
      label: REASON_LABEL[reason],
      note: REASON_NOTE[reason],
      count: pieces.length,
      content: (
        <ul className="mt-3 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {pieces.map((piece) => (
            <PieceTile key={piece.id} piece={piece} reason={reason} />
          ))}
        </ul>
      ),
    };
  });

  return (
    <>
      <Band top>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
          <div className="min-w-0">
            <h1 className="display max-w-[14ch]">The shelf</h1>
            <p className="mt-5 max-w-[56ch] text-lede leading-relaxed text-ink-muted">
              {onShelf} pieces are somewhere between wet clay and the collection shelf. They
              are grouped by what each one is actually waiting for, because &ldquo;how long
              has it been here&rdquo; is the least useful thing anybody can know about a pot.
            </p>
            <p className="mt-4 max-w-[56ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              {withoutDate} of them have no date. Every footprint below is drawn to the same
              scale — against Ash, the smallest kiln in the studio — so two tiles anywhere on
              this site are comparable.
            </p>
          </div>
          <Plate shot={shots.buckets} src={photos.buckets} priority />
        </div>
      </Band>

      <Band>
        <QueueFilter sections={sections} />
      </Band>
    </>
  );
}
