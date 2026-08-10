"use client";

import type { FloorView } from "@/lib/view";
import { hoursShort } from "@/lib/format";

/**
 * The floor plan, which is also the navigation.
 *
 * Each room is filled in proportion to how long the sun is in it that
 * day, so the drawing answers "which half of this house is worth having
 * in February" before a single number is read. Clicking a room selects
 * it; the room cards in the scrolling half follow.
 *
 * Hovering dims the others, and that is done entirely in CSS with
 * `:has()` — no state, no handler, no re-render. See `.plan:has(...)` in
 * globals.css.
 *
 * The label size is derived from the plan's own extent so that a 46-foot
 * bungalow and a 20-foot townhouse print their room names at the same
 * number of pixels, which they would not if the font size were a
 * constant in a scaled viewBox.
 */
export function Plan({
  floor,
  northOffset,
  seasonKey,
  dayLength,
  selected,
  onSelect,
}: {
  floor: FloorView;
  northOffset: number;
  seasonKey: "jun" | "sep" | "dec";
  dayLength: number;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const unit = Math.max(floor.w, floor.h);
  const label = unit * 0.042;
  const pad = unit * 0.02;

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${floor.w + pad * 2} ${floor.h + pad * 2}`}
      className="plan w-full"
      style={{ maxHeight: "58vh" }}
      role="group"
      aria-label={`Floor plan of the ${floor.name.toLowerCase()}`}
    >
      {floor.rooms.map((r) => {
        const hours = r.seasons[seasonKey].hours;
        const share = dayLength > 0 ? Math.min(1, hours / dayLength) : 0;
        const fill = r.interior
          ? "var(--color-well)"
          : hours === 0
            ? "var(--color-well)"
            : `color-mix(in oklch, var(--color-sun) ${Math.round(40 + share * 34)}%, var(--color-surface))`;
        const isSelected = selected === r.id;
        return (
          <g
            key={r.id}
            className="plan-room"
            data-selected={isSelected}
            role="button"
            tabIndex={r.interior ? -1 : 0}
            aria-pressed={isSelected}
            aria-label={`${r.name}, ${r.compass}, ${hoursShort(hours)} of direct sun`}
            onClick={() => !r.interior && onSelect(r.id)}
            onKeyDown={(e) => {
              if (r.interior) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(r.id);
              }
            }}
          >
            <rect
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              fill={fill}
              stroke={isSelected ? "var(--color-ink)" : "var(--color-line-strong)"}
              strokeWidth={isSelected ? 2.25 : 1}
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={r.x + r.w / 2}
              y={r.y + r.h / 2 - label * 0.15}
              textAnchor="middle"
              fontSize={label}
              className="datum"
              fill="var(--color-ink)"
            >
              {short(r.name)}
            </text>
            {!r.interior && (
              <text
                x={r.x + r.w / 2}
                y={r.y + r.h / 2 + label * 1.15}
                textAnchor="middle"
                fontSize={label * 0.86}
                className="datum"
                fill={hours === 0 ? "var(--color-ink-subtle)" : "var(--color-ink)"}
              >
                {r.compass} · {hoursShort(hours)}
              </text>
            )}
          </g>
        );
      })}

      {/* Which way is up. The plan is drawn to the house, not to the
          compass, so this is the only thing tying the two together —
          and every bearing on the page is derived from it. */}
      <g transform={`translate(${floor.w - unit * 0.07} ${unit * 0.075})`}>
        <g transform={`rotate(${-northOffset})`}>
          <line
            x1="0"
            y1={unit * 0.045}
            x2="0"
            y2={-unit * 0.045}
            stroke="var(--color-ink-muted)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M0 ${-unit * 0.055} L ${unit * 0.018} ${-unit * 0.022} L ${-unit * 0.018} ${-unit * 0.022} Z`}
            fill="var(--color-ink-muted)"
          />
        </g>
        {/* The label is placed by trig and never rotated. Rotating it with
            the arrow puts the N on the tail whenever the plan is turned
            past 90°, and upside down at 180° — which is exactly the case
            this template needs, since one of the six houses is drawn with
            its plan facing south. */}
        <text
          x={-unit * 0.075 * Math.sin((northOffset * Math.PI) / 180)}
          y={-unit * 0.075 * Math.cos((northOffset * Math.PI) / 180) + label * 0.3}
          textAnchor="middle"
          fontSize={label * 0.8}
          className="datum"
          fill="var(--color-ink-muted)"
        >
          N
        </text>
      </g>
    </svg>
  );
}

/** Room names are written for prose; a plan has about eleven characters. */
function short(name: string): string {
  const map: Record<string, string> = {
    "Principal bedroom": "Principal",
    "Second bedroom": "Bed 2",
    "Third bedroom": "Bed 3",
    "Kitchen and back room": "Kitchen",
    "Front sitting room": "Sitting",
    "Hall and stair": "Hall",
    "Living room": "Living",
    "Dining room": "Dining",
    "Garden room": "Garden rm",
    "Main room": "Main",
  };
  return map[name] ?? name;
}
