import { SHELLS } from "@/content/shells";
import { clock, shellById, type EmissionShare } from "@/lib/ballistics";
import { emissionColour, emitter, toCss, type EmissionId } from "@/lib/emission";
import type { ShowData } from "@/lib/show-data";

/**
 * A colour, as a mark. Never as a word on its own.
 *
 * The palette is computed from physics and physics does not care about
 * legibility: four of the eight emitters land within 21 degrees of hue,
 * because three of them are warm broadband sources near 590nm and there
 * is nothing to be done about that. So an emitter is always a swatch
 * AND its name — colour is never the only channel — and where the name
 * has to be coloured it uses the constructed ink variant that
 * `<StockStyle>` computes against this page's own paper.
 */
export function Swatch({ id, size = 10 }: { id: EmissionId; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 rounded-full align-middle"
      style={{
        width: size,
        height: size,
        background: toCss(emissionColour(id)),
        outline: "1px solid color-mix(in oklab, currentColor 25%, transparent)",
      }}
    />
  );
}

export function EmissionName({ id }: { id: EmissionId }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Swatch id={id} />
      <span>{emitter(id).name}</span>
    </span>
  );
}

/**
 * The cue sheet — the crew's document, which is the one nobody ever
 * publishes. One row per SEGMENT rather than per shell, because that is
 * the unit a script is written in and three hundred rows is a listing
 * rather than a document.
 *
 * It is also the accessible equivalent of the field above it: the field
 * is `aria-hidden`, because a plot of a thousand absolutely positioned
 * spans is noise to a screen reader, and everything it draws is in this
 * table in words.
 */
export function CueSheet({ data }: { data: ShowData }) {
  const rows = data.show.segments.map((segment) => {
    const shell = shellById(SHELLS, segment.shellId);
    const cues = data.cues.filter((c) => c.segmentId === segment.id);
    const first = cues[0];
    return { segment, shell, cues, first };
  });

  return (
    <table className="w-full border-collapse text-left text-sm">
      <caption className="sr-only">
        The full cue sheet for {data.show.title}: every segment, when it breaks
        and when it is fired.
      </caption>
      <thead>
        <tr className="rule text-left">
          <th scope="col" className="eyebrow py-2 pr-3 font-normal opacity-55">
            Fires
          </th>
          <th scope="col" className="eyebrow py-2 pr-3 font-normal opacity-55">
            Breaks
          </th>
          <th scope="col" className="eyebrow py-2 pr-3 font-normal opacity-55">
            Segment
          </th>
          <th scope="col" className="eyebrow hidden py-2 pr-3 font-normal opacity-55 sm:table-cell">
            Shell
          </th>
          <th scope="col" className="eyebrow py-2 pr-3 text-right font-normal opacity-55">
            No.
          </th>
          <th scope="col" className="eyebrow hidden py-2 pr-3 text-right font-normal opacity-55 md:table-cell">
            Height
          </th>
          <th scope="col" className="eyebrow py-2 text-right font-normal opacity-55">
            Cost
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ segment, shell, cues, first }) => (
          <tr key={segment.id} className="border-t border-current/10 align-baseline">
            <td className="num py-2.5 pr-3 whitespace-nowrap">
              {first ? clock(first.fireTenths) : "—"}
            </td>
            <td className="num py-2.5 pr-3 whitespace-nowrap opacity-60">
              {clock(segment.atTenths)}
            </td>
            <td className="py-2.5 pr-3">
              <span className="flex items-center gap-1.5">
                <Swatch id={shell.emissions[0]} />
                {segment.label}
              </span>
              {segment.note && (
                <span className="prose-body mt-1 block max-w-md text-xs opacity-60">
                  {segment.note}
                </span>
              )}
            </td>
            <td className="hidden py-2.5 pr-3 opacity-70 sm:table-cell">{shell.name}</td>
            <td className="num py-2.5 pr-3 text-right">{cues.length}</td>
            <td className="num hidden py-2.5 pr-3 text-right opacity-70 md:table-cell">
              {segment.altitudeM ?? shell.altitudeM} m
            </td>
            <td className="num py-2.5 text-right whitespace-nowrap">
              £{(cues.length * shell.costUsd).toLocaleString("en-GB")}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t-2 border-current/25">
          <td className="num py-3 pr-3 whitespace-nowrap" colSpan={4}>
            {data.cues.length} shells
          </td>
          <td className="num py-3 pr-3 text-right">{data.cues.length}</td>
          <td className="hidden md:table-cell" />
          <td className="num py-3 text-right whitespace-nowrap">
            £{data.costUsd.toLocaleString("en-GB")}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

/** The colour budget, as a bar and a list. Both, because neither alone works. */
export function ColourBudget({
  budget,
  label = "Where the light comes from",
}: {
  budget: readonly EmissionShare[];
  label?: string;
}) {
  return (
    <div>
      <p className="eyebrow opacity-55">{label}</p>
      <div
        className="mt-3 flex h-3 w-full overflow-hidden rounded-full"
        role="img"
        aria-label={budget
          .map((r) => `${emitter(r.id).name} ${Math.round(r.share * 100)}%`)
          .join(", ")}
      >
        {budget.map((r) => (
          <span
            key={r.id}
            style={{
              width: `${r.share * 100}%`,
              background: toCss(emissionColour(r.id)),
            }}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-1.5 text-sm">
        {budget.map((r) => (
          <li key={r.id} className="flex items-baseline justify-between gap-4">
            <EmissionName id={r.id} />
            <span className="num opacity-70">
              {(r.share * 100).toFixed(1)}% · £{r.costUsd.toLocaleString("en-GB")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
