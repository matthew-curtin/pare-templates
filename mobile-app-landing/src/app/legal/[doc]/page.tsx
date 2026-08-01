import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { DocBody } from "@/components/doc-body";
import { getLegalDoc, legalDocs } from "@/content/legal";
import { formatDate } from "@/lib/format";

/** Pre-renders the privacy policy and the terms at build time. */
export function generateStaticParams() {
  return legalDocs.map((item) => ({ doc: item.slug }));
}

/* `params` is a Promise in Next 15 and later, so it has to be awaited. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  const legal = getLegalDoc(doc);
  if (!legal) return {};

  return { title: legal.title, description: legal.intro };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const legal = getLegalDoc(doc);
  if (!legal) notFound();

  return (
    <article>
      <div className="border-b border-line bg-aurora">
        <Container width="narrow" className="py-14 sm:py-18">
          <nav className="flex gap-2">
            {legalDocs.map((item) => (
              <Link
                key={item.slug}
                href={`/legal/${item.slug}`}
                aria-current={item.slug === legal.slug ? "page" : undefined}
                className={
                  item.slug === legal.slug
                    ? "rounded-full bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink"
                    : "rounded-full px-3.5 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
                }
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <h1 className="mt-8 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {legal.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted text-pretty">
            {legal.intro}
          </p>
          <p className="mt-6 text-sm text-ink-subtle">
            Last updated{" "}
            <time dateTime={legal.updated}>{formatDate(legal.updated)}</time>
          </p>
        </Container>
      </div>

      <Container width="narrow" className="py-14 sm:py-18">
        <DocBody blocks={legal.body} />

        <p className="mt-16 rounded-xl border border-line bg-surface p-5 text-sm leading-relaxed text-ink-subtle">
          This document is a plain-English placeholder written so the page has
          real shape to design against. It is not legal advice and has not been
          reviewed by a lawyer — replace it before you ship anything to real
          people.
        </p>
      </Container>
    </article>
  );
}
