import type { Metadata } from "next";
import Link from "next/link";
import { getNav } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Everything there is to read, grouped by what you are trying to do.",
};

export default function DocsIndexPage() {
  const nav = getNav();
  const first = nav[0]?.items[0];

  return (
    <main className="min-w-0 flex-1 py-8 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Documentation</h1>
        <p className="mt-2 max-w-2xl text-[17px] leading-7 text-ink-muted">
          Grouped by what you are trying to do. If you have never used this before, start at{" "}
          {first ? (
            <Link href={`/docs/${first.slug}`} className="prose-link focus-ring">
              {first.title}
            </Link>
          ) : (
            "the beginning"
          )}{" "}
          and read forward — every page links to the next one.
        </p>
      </header>

      <div className="space-y-10">
        {nav.map((group) => (
          <section key={group.dir}>
            <h2 className="mb-1 text-lg font-semibold tracking-tight">{group.label}</h2>
            <p className="mb-4 text-sm text-ink-subtle">{GROUP_BLURBS[group.dir] ?? ""}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {group.items.map((item) => (
                <li key={item.slug} className="min-w-0">
                  <Link
                    href={`/docs/${item.slug}`}
                    className="focus-ring group block h-full rounded-lg border border-border p-4 transition hover:border-border-strong hover:bg-surface"
                  >
                    <span className="block font-medium text-ink group-hover:text-accent">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-ink-muted">
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

/* One line of orientation per group. Keyed by folder name, so a group
   declared in site.ts without a blurb here renders without one rather
   than breaking. */
const GROUP_BLURBS: Record<string, string> = {
  "getting-started": "Enough to have it working, in order.",
  concepts: "The four objects everything else is built from.",
  guides: "The things worth getting right before you depend on them.",
  tooling: "The command line tool.",
};
