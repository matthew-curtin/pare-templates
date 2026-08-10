export function Stat({
  value,
  label,
  tone = "ink",
  size = "md",
}: {
  value: string;
  label: string;
  tone?: "ink" | "sun" | "muted";
  size?: "sm" | "md" | "lg";
}) {
  const colour =
    tone === "sun"
      ? "text-sun"
      : tone === "muted"
        ? "text-ink-subtle"
        : "text-ink";
  const scale =
    size === "lg"
      ? "text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)]"
      : size === "sm"
        ? "text-[1.0625rem]"
        : "text-[1.375rem]";
  return (
    <div>
      <div className={`figure ${scale} ${colour} leading-none`}>{value}</div>
      <div className="datum mt-1.5 text-[0.6875rem] uppercase text-ink-subtle">
        {label}
      </div>
    </div>
  );
}
