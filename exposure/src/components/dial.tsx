/**
 * The compass, with the sun's path across it.
 *
 * The orange arc is where the sun goes that day, from the bearing it
 * rises on to the bearing it sets on. The pale wedge is the 180° a
 * particular window can see. Where they overlap is when there is sun in
 * the room, and putting them on the same circle is the shortest possible
 * proof of the site's least believable claim: on 21 June the arc runs
 * from north-east round to north-west, so a north window catches both
 * ends of it and misses the middle — and on 21 December the arc never
 * leaves the southern half at all, so the same window gets nothing.
 *
 * North is at the top and bearings run clockwise, which is also how a
 * conic-gradient works, so an azimuth is an angle with no conversion.
 */
export function Dial({
  arc,
  bearing,
  label,
}: {
  arc: { from: number; to: number };
  bearing?: number;
  label?: string;
}) {
  const points = [
    ["N", 0],
    ["E", 90],
    ["S", 180],
    ["W", 270],
  ] as const;

  return (
    <div>
      <div className="relative aspect-square w-full rounded-full border border-line bg-surface">
        {/* The angles are set on the elements that USE them, not on a
            parent: they are registered with `inherits: false` so that one
            dial cannot leak its arc into another, which means a value set
            on an ancestor never arrives and the arc silently draws
            nothing. Keeping them local also puts the transition on the
            element that animates. */}
        {bearing !== undefined && (
          <div
            className="dial-wedge absolute inset-[9%] rounded-full"
            style={{ "--wedge-from": `${bearing - 90}deg` } as React.CSSProperties}
            aria-hidden="true"
          />
        )}
        <div
          className="dial-arc absolute inset-[9%] rounded-full"
          style={
            { "--arc-from": `${arc.from}deg`, "--arc-to": `${arc.to}deg` } as React.CSSProperties
          }
          aria-hidden="true"
        />

        {/* Cross-hairs, so a bearing can be read off rather than guessed. */}
        <div className="absolute inset-x-[9%] top-1/2 h-px bg-line" aria-hidden="true" />
        <div className="absolute inset-y-[9%] left-1/2 w-px bg-line" aria-hidden="true" />

        {/* Drawn as a line rather than a rotated box. Two attempts before
            this one were wrong in different ways: composing a centring
            translate with a rotation applies the translate in the rotated
            frame (a south-facing room pointed north), and rotating a
            full-size container grows its bounding rect by √2, which put
            two pixels of horizontal overflow on the one page whose room
            faces north-west. A line has no box to grow. */}
        {bearing !== undefined && (
          <svg viewBox="-50 -50 100 100" className="absolute inset-0" aria-hidden="true">
            <line
              x1="0"
              y1="0"
              x2={35 * Math.sin((bearing * Math.PI) / 180)}
              y2={-35 * Math.cos((bearing * Math.PI) / 180)}
              stroke="var(--color-ink)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}

        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" aria-hidden="true" />

        {/* Placed by trigonometry rather than by rotate-then-translate:
            a percentage translate resolves against the ELEMENT'S OWN box,
            so translating a two-character label by 46% moves it about
            five pixels and stacks all four in the middle. */}
        {points.map(([name, deg]) => (
          <span
            key={name}
            className="datum absolute text-[0.6875rem] text-ink-subtle"
            style={{
              left: `${50 + 45 * Math.sin((deg * Math.PI) / 180)}%`,
              top: `${50 - 45 * Math.cos((deg * Math.PI) / 180)}%`,
              transform: "translate(-50%,-50%)",
            }}
            aria-hidden="true"
          >
            {name}
          </span>
        ))}
      </div>
      {label && (
        <p className="datum mt-2 text-center text-[0.6875rem] uppercase text-ink-subtle">
          {label}
        </p>
      )}
    </div>
  );
}
