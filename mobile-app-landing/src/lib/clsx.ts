/**
 * Joins class names, dropping anything falsy.
 * Small enough not to warrant a dependency.
 */
export function clsx(
  ...parts: (string | false | null | undefined)[]
): string {
  return parts.filter(Boolean).join(" ");
}
