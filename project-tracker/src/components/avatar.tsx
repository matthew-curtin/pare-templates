import type { Member } from "@/content/types";

/**
 * A person, drawn from their initials.
 *
 * No photographs: a real face attached to an invented person sits
 * badly, and this keeps the template free of image files entirely.
 * The full name is always available to assistive technology even when
 * the visible content is two letters.
 *
 * `relative` on the outer span is not decoration. `sr-only` positions
 * its element absolutely, so without a positioned ancestor the hidden
 * name resolves against the page instead of the avatar — inside a
 * horizontally scrolled table that puts it hundreds of pixels off to
 * the right and inflates the document's scroll width.
 */
export function Avatar({
  member,
  size = "md",
}: {
  member: Member | undefined;
  size?: "sm" | "md" | "lg";
}) {
  const box =
    size === "sm"
      ? "h-6 w-6 text-[10px]"
      : size === "lg"
        ? "h-11 w-11 text-sm"
        : "h-7 w-7 text-[11px]";

  if (!member) {
    return (
      <span
        className={`${box} relative inline-flex shrink-0 items-center justify-center rounded-full border border-dashed border-line-strong text-ink-subtle`}
        title="Unassigned"
      >
        <span className="sr-only">Unassigned</span>
        <span aria-hidden="true">—</span>
      </span>
    );
  }

  return (
    <span
      className={`${box} relative inline-flex shrink-0 items-center justify-center rounded-full bg-raised-hover font-semibold text-ink-muted ring-1 ring-line-strong`}
      title={member.name}
    >
      <span className="sr-only">{member.name}</span>
      <span aria-hidden="true">{member.initials}</span>
    </span>
  );
}
