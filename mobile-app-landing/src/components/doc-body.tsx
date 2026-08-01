import type { DocBlock } from "@/content/types";

/**
 * Renders a typed block list — used by help articles and legal pages.
 * Typed blocks rather than markdown: no dependency, no build step, and
 * the editor catches a missing field straight away.
 */
export function DocBody({ blocks }: { blocks: DocBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="pt-4 text-xl font-bold tracking-tight text-ink">
          {block.text}
        </h2>
      );

    case "paragraph":
      return (
        <p className="leading-relaxed text-ink-muted">{block.text}</p>
      );

    case "list":
      return (
        <ul className="space-y-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed text-ink-muted">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              />
              {item}
            </li>
          ))}
        </ul>
      );

    case "steps":
      return (
        <ol className="space-y-3">
          {block.items.map((item, index) => (
            <li key={item} className="flex gap-3.5 leading-relaxed text-ink-muted">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cool-soft text-xs font-bold text-cool">
                {index + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      );

    case "note":
      return (
        <aside className="rounded-xl border border-accent-ring bg-accent-soft p-5">
          <p className="text-xs font-bold tracking-[0.14em] text-accent uppercase">
            Worth knowing
          </p>
          <p className="mt-2 leading-relaxed text-ink-muted">{block.text}</p>
        </aside>
      );
  }
}
