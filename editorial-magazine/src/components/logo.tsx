import { site } from "@/content/site";

/**
 * The masthead. Set in the display face rather than drawn as an image,
 * so it stays sharp, reflows, and can be edited by changing
 * `site.name` — a logo that is really just type should be type.
 *
 * The rule under it is the meridian: the line the magazine is named
 * for.
 */
export function Logo({ size = "default" }: { size?: "default" | "large" }) {
  const large = size === "large";
  return (
    <span className="inline-flex flex-col items-center">
      <span
        className={`font-display font-semibold tracking-[-0.02em] text-ink ${
          large ? "text-5xl sm:text-7xl" : "text-2xl"
        }`}
      >
        {site.name}
      </span>
      <span
        aria-hidden="true"
        className={`mt-1 block bg-accent ${large ? "h-px w-24 sm:w-32" : "h-px w-full"}`}
      />
    </span>
  );
}
