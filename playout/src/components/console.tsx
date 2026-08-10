import { Link } from "react-router-dom";
import { describe } from "@/lib/describe";
import { clockSeconds, duration, signedShort } from "@/lib/format";
import { NOW } from "@/content/site";
import { comingUp, hourStatByHour, onAir } from "@/lib/station";
import { toJunction } from "@/lib/schedule";
import { Readout } from "./bits";

/**
 * The console.
 *
 * Docked to the bottom edge of every route, and the reason this template
 * exists in the shape it does. It is not a header that happens to be at
 * the bottom: it is the instrument. You can be three pages away reading
 * the underwriting report and still know that the record on air ends in
 * three minutes and the hour is not going to make its junction.
 *
 * Everything in it is derived from one number — the pinned second in
 * `site.ts` — laid against a log that was itself derived. Nothing here
 * is a prop somebody has to remember to update.
 */
export function Console() {
  const stat = onAir ? hourStatByHour.get(onAir.placed.hour) : undefined;
  const junction = toJunction(NOW);
  const shown = onAir ? describe(onAir.placed) : null;
  const next = comingUp[0] ? describe(comingUp[0]) : null;
  const missing = stat ? Math.abs(stat.drift) > stat.tolerance : false;
  const progress = onAir ? Math.round(onAir.progress * 1000) / 10 : 0;

  return (
    <div className="console">
      <div className="playhead-track h-1 w-full">
        <div
          className="playhead-fill h-full"
          data-over={missing}
          style={{ "--playhead": `${progress}%` } as React.CSSProperties}
        />
      </div>

      <div className="grid grid-cols-2 items-start gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:grid-cols-[13rem_minmax(0,1fr)_11rem_11rem]">
        <div className="flex items-center gap-2" data-on-air={onAir !== null}>
          <span
            className="on-air-dot inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ background: "var(--color-live)" }}
            aria-hidden="true"
          />
          <span className="pill border-0 px-0 text-live">On air</span>
          <span className="tnum ml-auto text-[0.8125rem] text-ink-muted lg:ml-0">
            {clockSeconds(NOW)}
          </span>
        </div>

        <div className="col-span-2 min-w-0 lg:col-span-1">
          {shown ? (
            <>
              <div className="flex min-w-0 items-baseline gap-2">
                <span className="pill border-0 px-0 text-ink-subtle">{shown.kind}</span>
                <span className="truncate text-[0.9375rem] text-ink">{shown.title}</span>
                {shown.by ? (
                  <span className="truncate text-[0.875rem] text-ink-muted">
                    {shown.by}
                  </span>
                ) : null}
              </div>
              <div className="tnum mt-1 flex items-baseline gap-3 text-[0.75rem] text-ink-subtle">
                <span>{duration(onAir ? onAir.elapsed : 0)} in</span>
                <span className="text-signal">
                  {duration(onAir ? onAir.remaining : 0)} left
                </span>
                {shown.ramp !== null ? <span>talk over {duration(shown.ramp)}</span> : null}
              </div>
            </>
          ) : (
            <span className="text-[0.9375rem] text-ink-muted">Off air</span>
          )}
        </div>

        <Readout label="Next">
          {next ? (
            <span className="truncate">
              {next.title}
              {next.by ? <span className="text-ink-muted"> · {next.by}</span> : null}
            </span>
          ) : (
            "Junction"
          )}
        </Readout>

        <Readout label="To junction" tone={missing ? "live" : undefined}>
          {duration(junction)}
          {stat && missing ? (
            <span className="ml-2 text-[0.75rem] text-live">
              hour {signedShort(stat.drift)}
            </span>
          ) : null}
        </Readout>
      </div>

      {stat && missing ? (
        <p className="border-t border-line/70 px-4 py-2 text-[0.75rem] text-live sm:px-6">
          This hour runs {signedShort(stat.drift)} past the junction. Nothing left in
          it is long enough to lose —{" "}
          <Link to="/day" className="focus-ring underline underline-offset-2">
            see what is in it
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
