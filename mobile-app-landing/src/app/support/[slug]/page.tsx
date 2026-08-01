import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { DocBody } from "@/components/doc-body";
import { articles, getArticle } from "@/content/support";
import { site } from "@/content/site";
import { formatDate } from "@/lib/format";

/** Pre-renders one page per article at build time. */
export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

/*
 * `params` is a Promise in Next 15 and later, so it has to be awaited —
 * in the page and in generateMetadata alike.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return { title: article.title, description: article.summary };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const others = articles.filter(
    (item) => item.category === article.category && item.slug !== article.slug,
  );

  return (
    <article>
      <div className="border-b border-line bg-aurora">
        <Container width="narrow" className="py-14 sm:py-18">
          <Link
            href="/support"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <span aria-hidden="true">←</span> Help centre
          </Link>

          <p className="mt-8 text-xs font-bold tracking-[0.14em] text-accent uppercase">
            {article.category}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted text-pretty">
            {article.summary}
          </p>
          <p className="mt-6 text-sm text-ink-subtle">
            Updated{" "}
            <time dateTime={article.updated}>{formatDate(article.updated)}</time>
          </p>
        </Container>
      </div>

      <Container width="narrow" className="py-14 sm:py-18">
        <DocBody blocks={article.body} />

        <div className="mt-16 rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-bold text-ink">Did this sort it?</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            If not, write to{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-accent hover:text-accent-hover"
            >
              {site.email}
            </a>{" "}
            and tell us what happened. A person reads every message.
          </p>
        </div>

        {others.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xs font-bold tracking-[0.14em] text-ink-subtle uppercase">
              More in {article.category}
            </h2>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/support/${item.slug}`}
                    className="block py-4 font-semibold text-ink-muted transition-colors hover:text-ink"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </article>
  );
}
