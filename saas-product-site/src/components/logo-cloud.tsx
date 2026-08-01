import { customerLogos } from "@/content/site";

/**
 * Social proof row. Rendered as wordmarks rather than image files, so
 * there are no logo assets to license and the row scales cleanly.
 */
export function LogoCloud({ heading }: { heading?: string }) {
  return (
    <div>
      {heading && (
        <p className="text-center text-sm text-ink-subtle">{heading}</p>
      )}
      <div className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
        {customerLogos.map((name) => (
          <span
            key={name}
            className="text-center text-base font-semibold tracking-tight text-ink-subtle/70"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
