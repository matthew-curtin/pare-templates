import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { NavIcon } from "./nav-icon";

/** The buttons, fields and the one popover the app uses. */

type ButtonTone = "primary" | "quiet" | "ghost" | "danger";

const TONES: Record<ButtonTone, string> = {
  primary:
    "bg-accent text-on-accent hover:bg-accent-hover disabled:bg-line-strong disabled:text-ink-subtle",
  quiet:
    "border border-line bg-surface text-ink hover:bg-hover disabled:text-ink-subtle",
  ghost: "text-ink-muted hover:bg-hover hover:text-ink",
  danger: "border border-line bg-surface text-overdue hover:bg-overdue-soft",
};

export function Button({
  children,
  tone = "quiet",
  icon,
  ...rest
}: {
  children: ReactNode;
  tone?: ButtonTone;
  icon?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className={`focus-ring inline-flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed ${TONES[tone]} ${rest.className ?? ""}`}
    >
      {icon ? <NavIcon name={icon} className="size-4" /> : null}
      {children}
    </button>
  );
}

export function IconButton({
  label,
  icon,
  ...rest
}: {
  label: string;
  icon: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={`focus-ring inline-flex size-8 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-hover hover:text-ink ${rest.className ?? ""}`}
    >
      <NavIcon name={icon} className="size-4" />
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-[13px] font-medium text-ink">
        {label}
      </label>
      {hint ? (
        <p className="mt-0.5 text-[12px] text-ink-subtle">{hint}</p>
      ) : null}
      <div className="mt-1.5">{children(id)}</div>
    </div>
  );
}

export const inputClasses =
  "focus-ring w-full rounded-md border border-line bg-surface px-2.5 py-1.5 text-[13px] text-ink placeholder:text-ink-subtle";

export function Select({
  value,
  onChange,
  options,
  label,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
  className?: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`focus-ring rounded-md border border-line bg-surface px-2 py-1.5 text-[12px] text-ink ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/**
 * A small menu anchored under its trigger.
 *
 * Closes on Escape and on a click anywhere outside, both of which are
 * the difference between a menu and a thing stuck to the page. The
 * outside click listens on `pointerdown` rather than `click` so that
 * choosing something in one menu while another is open does not need
 * two clicks — the first would otherwise be spent closing.
 */
export function Popover({
  trigger,
  children,
  align = "left",
  width = "w-56",
}: {
  trigger: (props: {
    onClick: () => void;
    "aria-expanded": boolean;
  }) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "left" | "right";
  width?: string;
}) {
  const [open, setOpen] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!hostRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={hostRef} className="relative">
      {trigger({ onClick: () => setOpen((was) => !was), "aria-expanded": open })}
      {open ? (
        <div
          className={`absolute top-[calc(100%+4px)] z-30 ${align === "right" ? "right-0" : "left-0"} ${width} overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-lg shadow-ink/10`}
        >
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}

export function MenuItem({
  children,
  onClick,
  selected = false,
}: {
  children: ReactNode;
  onClick: () => void;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] transition-colors hover:bg-hover ${
        selected ? "text-accent" : "text-ink"
      }`}
    >
      {children}
      {selected ? <NavIcon name="check" className="ml-auto size-3.5" /> : null}
    </button>
  );
}
