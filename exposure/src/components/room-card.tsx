import type { RoomView } from "@/lib/view";
import type { SeasonKey } from "@/content/site";
import { Strip } from "./strip";
import { Plate } from "./plate";
import { clock, dateOfDoy, hoursShort, percent, sqft } from "@/lib/format";

/** Borrowed off Plate rather than imported from Next's image module. A
 *  type-only import of `StaticImageData` would be erased at build time
 *  and still count against the repo checker's "exactly one file imports
 *  it" rule, which is the checker being blunt rather than wrong — and
 *  this is the cheap way round it. */
type PlateSrc = Parameters<typeof Plate>[0]["src"];

const DAYLIGHTING_GLOSS: Record<RoomView["daylighting"], string> = {
  generous: "generously glazed",
  adequate: "adequately glazed",
  dim: "under-glazed",
};

export function RoomCard({
  room,
  seasonKey,
  photos,
  selected,
  onSelect,
}: {
  room: RoomView;
  seasonKey: SeasonKey;
  photos: Record<string, PlateSrc>;
  selected: boolean;
  onSelect?: () => void;
}) {
  const data = room.seasons[seasonKey];
  const shot = room.shot;

  return (
    <article
      id={`room-${room.id}`}
      className={`scroll-mt-6 border-l-2 px-4 py-6 transition-colors sm:px-5 ${
        selected ? "border-l-ink bg-surface" : "border-l-transparent"
      }`}
    >
      <div className="room-card grid gap-x-8 gap-y-4">
        <div className="min-w-0">
          <h3 className="head head-small text-[1.25rem]">
            {onSelect ? (
              <button
                type="button"
                onClick={onSelect}
                className="focus-ring text-left transition-colors hover:text-sun"
              >
                {room.name}
              </button>
            ) : (
              room.name
            )}
          </h3>
          <p className="datum mt-1 text-[0.75rem] uppercase text-ink-subtle">
            {room.floorName} · {room.interior ? "no exterior wall" : `${room.compass}, ${Math.round(room.bearing)}°`}
          </p>

          {!room.interior && (
            <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-muted">
              {sqft(room.area)}, {room.glazing} sq ft of glass —{" "}
              {percent(room.glazingRatio)} of the floor, which is{" "}
              {DAYLIGHTING_GLOSS[room.daylighting]}.
            </p>
          )}

          {room.obstruction && (
            <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
              In the way: {room.obstruction.what}, standing{" "}
              {room.obstruction.elevation}° above the sill between{" "}
              {room.obstruction.from}° and {room.obstruction.to}°.
            </p>
          )}

          {room.darkDays > 0 && room.firstLit !== null && room.lastLit !== null && (
            <p className="mt-2 text-[0.875rem] leading-relaxed text-ink">
              No direct sun at all from {dateOfDoy(room.lastLit)} to{" "}
              {dateOfDoy(room.firstLit)} — {room.darkDays} days of the year.
            </p>
          )}

          {room.interior && (
            <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-muted">
              {sqft(room.area)}, and no exterior wall — so no direct sun at
              any hour of any day of the year, and nothing for a survey to
              measure. It is listed here so the plan adds up.
            </p>
          )}

          {room.note && (
            <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-muted">
              {room.note}
            </p>
          )}
        </div>

        {!room.interior && (
          <div className="room-card-figures">
            <div className="figure text-[1.75rem] leading-none text-ink">
              {hoursShort(data.hours)}
            </div>
            <div className="datum mt-1.5 text-[0.6875rem] uppercase text-ink-subtle">
              of direct sun
            </div>
          </div>
        )}
      </div>

      {!room.interior && (
        <div className="mt-5">
          <Strip segments={data.segments} ticks />
          <p className="mt-2.5 text-[0.8125rem] text-ink-muted">
            {data.intervals.length === 0
              ? "No direct sun at any hour of this day."
              : data.intervals
                  .map((i) => `${clock(i.from)} – ${clock(i.to)}`)
                  .join(", ")}
          </p>
        </div>
      )}

      {shot && photos[shot.file] && (
        <Plate
          className="mt-6"
          src={photos[shot.file]}
          alt={shot.alt}
          aspect={`${photos[shot.file].width} / ${photos[shot.file].height}`}
          sizes="(min-width: 1024px) 40rem, 100vw"
          width="max-w-[34rem]"
          hour={`${clock(shot.hour)}, ${shot.day}/${shot.month}`}
          caption={shot.caption}
        />
      )}
    </article>
  );
}
