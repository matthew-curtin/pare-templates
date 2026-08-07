import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocToc } from "@/components/doc-toc";
import { Markdown } from "@/components/markdown";
import { getAdjacent, getAllDocs, getDoc } from "@/lib/docs";

type Props = { params: Promise<{ slug: string[] }> };

/** Every doc page is generated at build time from the markdown on disk. */
export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug.join("/"));
  if (!doc) return {};
  return { title: doc.title, description: doc.description };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDoc(slug.join("/"));
  if (!doc) notFound();

  const { prev, next } = getAdjacent(doc.slug);

  return (
    <>
      {/* min-w-0 is load-bearing: a flex child will not shrink below its
          content, so without it a wide code block or table pushes the
          whole page sideways instead of scrolling inside its own box. */}
      <main className="min-w-0 flex-1 py-8 lg:px-8">
        <article>
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{doc.title}</h1>
            {doc.description && (
              <p className="mt-2 text-[17px] leading-7 text-ink-muted">{doc.description}</p>
            )}
          </header>

          {/* The markdown body, walked into React elements. */}
          <Markdown tokens={doc.tokens} />
        </article>

        <nav className="mt-14 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/docs/${prev.slug}`}
              className="focus-ring group min-w-0 rounded-lg border border-border p-4 transition hover:border-border-strong hover:bg-surface"
            >
              <span className="text-xs text-ink-subtle">← Previous</span>
              <span className="mt-1 block truncate font-medium text-ink group-hover:text-accent">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/docs/${next.slug}`}
              className="focus-ring group min-w-0 rounded-lg border border-border p-4 text-right transition hover:border-border-strong hover:bg-surface sm:col-start-2"
            >
              <span className="text-xs text-ink-subtle">Next →</span>
              <span className="mt-1 block truncate font-medium text-ink group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      </main>

      <DocToc headings={doc.headings} />
    </>
  );
}
