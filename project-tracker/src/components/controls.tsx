/**
 * The small form controls the filter bars are built from.
 *
 * A native `<select>` rather than a custom dropdown, on purpose: it is
 * keyboard-accessible, screen-reader-correct and usable on a phone
 * without any of that being written here. The styling is the arrow and
 * the surface; the behaviour is the platform's.
 */
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2 text-[11px] text-ink-subtle">
      <span className="sr-only sm:not-sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="focus-ring appearance-none rounded-md border border-line bg-raised bg-[length:9px] bg-[right_0.6rem_center] bg-no-repeat py-1.5 pr-7 pl-2.5 text-[12px] text-ink"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' fill='none' stroke='%2398a3b3' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-ink-subtle"
      >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M15.5 15.5L21 21" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="focus-ring w-full rounded-md border border-line bg-raised py-1.5 pr-2.5 pl-8 text-[12px] text-ink placeholder:text-ink-subtle sm:w-56"
      />
    </div>
  );
}

/** A headline figure. Used across the board and the team page. */
export function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2.5">
      <div className="text-[11px] tracking-wide text-ink-subtle uppercase">
        {label}
      </div>
      <div className="tabular mt-1 text-xl font-semibold">{value}</div>
      {detail && <div className="text-[11px] text-ink-subtle">{detail}</div>}
    </div>
  );
}

/** The title block at the top of every page. */
export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        <p className="mt-0.5 max-w-2xl text-[13px] text-ink-muted">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}
