import type { PastFiring, Program } from "@/content/types";

/**
 * A firing's temperature log, drawn.
 *
 * §4b: the axis maximum is 1400°C in seven steps of 200, because a
 * "nice-looking" maximum split five ways gives 280 and nobody reads a
 * chart in units of 280. The hours are marked every two.
 *
 * One line, one measure, one axis. There is a second thing worth
 * plotting here — the rate of climb — and it is deliberately not on the
 * same chart, because two measures on two scales invent a relationship
 * the data does not contain.
 */

const MAX_C = 1400;
const STEP_C = 200;
const STEP_H = 2;

export function Curve({ firing, program }: { firing: PastFiring; program: Program }) {
  const hours = Math.max(...firing.log.map(([h]) => h));
  const w = 100;
  const h = 100;

  const x = (hour: number) => (hour / hours) * w;
  const y = (c: number) => h - (c / MAX_C) * h;

  const path = firing.log
    .map(([hour, c], i) => `${i === 0 ? "M" : "L"} ${x(hour).toFixed(2)} ${y(c).toFixed(2)}`)
    .join(" ");

  const cLines = Array.from({ length: MAX_C / STEP_C + 1 }, (_, i) => i * STEP_C);
  const hLines = Array.from({ length: Math.floor(hours / STEP_H) + 1 }, (_, i) => i * STEP_H);

  return (
    <figure className="m-0">
      <div className="flex gap-2">
        <ul className="figure flex list-none flex-col-reverse justify-between p-0 text-[0.625rem] text-ink-subtle">
          {cLines.map((c) => (
            <li key={c} className="leading-none">
              {c}
            </li>
          ))}
        </ul>
        <div className="min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="none"
            className="block h-44 w-full border border-line-strong bg-sunk"
            role="img"
            aria-label={`Temperature against time for ${program.name}: ${hours} hours, peaking at ${program.peak}°C.`}
          >
            {cLines.slice(1, -1).map((c) => (
              <line
                key={c}
                x1="0"
                x2={w}
                y1={y(c)}
                y2={y(c)}
                stroke="var(--color-line)"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <line
              x1="0"
              x2={w}
              y1={y(program.peak)}
              y2={y(program.peak)}
              stroke="var(--color-ink-subtle)"
              strokeWidth="1"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={path}
              fill="none"
              stroke="var(--color-fire)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <ul className="figure mt-1 flex list-none justify-between p-0 text-[0.625rem] text-ink-subtle">
            {hLines.map((hour) => (
              <li key={hour}>{hour}h</li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="mt-2 text-[0.8125rem] leading-snug text-ink-subtle">
        °C against hours from ignition. The dashed line is cone {program.cone} at {program.peak}°C.
      </figcaption>
    </figure>
  );
}

/**
 * The same log as a table, because a value that exists nowhere else on
 * the page must be readable as text and a tooltip is never the only way
 * to read one (§4b).
 */
export function CurveTable({ firing }: { firing: PastFiring }) {
  return (
    <table className="figure w-full border-collapse text-left text-[0.8125rem]">
      <caption className="sr-only">Controller log, hours from ignition against °C</caption>
      <thead>
        <tr className="border-b border-line-strong">
          <th scope="col" className="py-1 pr-3 font-normal text-ink-subtle">
            Hour
          </th>
          <th scope="col" className="py-1 font-normal text-ink-subtle">
            °C
          </th>
        </tr>
      </thead>
      <tbody>
        {firing.log.map(([hour, c]) => (
          <tr key={hour} className="border-b border-line">
            <td className="py-1 pr-3 tabular-nums">{hour}</td>
            <td className="py-1 tabular-nums">{c}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
