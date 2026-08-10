/**
 * A number and what it is.
 *
 * The figure is the display type on this site — §4c asks for a position
 * on typography and this template's position is that the headings stay
 * small and the numbers get the size, because the numbers are the
 * argument. `.figure` puts them on Recursive's MONO axis, which is what
 * makes them read as an instrument's output rather than as prose.
 */
export function Stat({
  value,
  label,
  tone = "ink",
  size = "md",
}: {
  value: string;
  label: string;
  tone?: "ink" | "water" | "warn";
  size?: "md" | "lg";
}) {
  const toneClass =
    tone === "water" ? "text-water" : tone === "warn" ? "text-warn" : "text-ink";
  return (
    <div>
      <p
        className={`figure leading-none ${toneClass} ${
          size === "lg" ? "text-figure" : "text-[1.75rem] sm:text-[2.25rem]"
        }`}
      >
        {value}
      </p>
      <p className="mt-2 text-[0.8125rem] leading-snug text-ink-subtle">{label}</p>
    </div>
  );
}
