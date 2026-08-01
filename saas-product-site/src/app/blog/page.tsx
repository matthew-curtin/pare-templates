import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { CtaBand } from "@/components/cta-band";
import { posts } from "@/content/posts";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing about delivery metrics, code review and how software actually ships.",
};

export default function BlogPage() {
  const [lead, ...rest] = posts;

  return (
    <>
      <Container>
        <div className="max-w-2xl py-20 sm:py-24">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            Blog
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Notes on how software actually ships
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-ink-muted">
            Research, opinions and the occasional thing we got wrong.
          </p>
        </div>

        {/* Lead post */}
        <Link
          href={`/blog/${lead.slug}`}
          className="group grid gap-8 rounded-2xl border border-line p-6 transition-all hover:border-accent-ring hover:shadow-xl hover:shadow-ink/5 lg:grid-cols-2 lg:p-8"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface">
            <Image
              src={lead.cover}
              alt={lead.coverAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-medium text-accent uppercase">
              {lead.category}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance group-hover:text-accent sm:text-3xl">
              {lead.title}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-muted">
              {lead.excerpt}
            </p>
            <p className="mt-6 text-sm text-ink-subtle">
              {lead.author.name} · {formatDate(lead.date)} ·{" "}
              {lead.readingMinutes} min read
            </p>
          </div>
        </Link>

        {/* The rest */}
        <div className="grid gap-8 py-16 md:grid-cols-3">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface">
                <Image
                  src={post.cover}
                  alt={post.coverAlt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-5 text-xs font-medium text-accent uppercase">
                {post.category}
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-balance group-hover:text-accent">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                {post.excerpt}
              </p>
              <p className="mt-4 text-xs text-ink-subtle">
                {formatDate(post.date)} · {post.readingMinutes} min read
              </p>
            </Link>
          ))}
        </div>
      </Container>

      <CtaBand
        title="Get the occasional post by email"
        subtitle="Roughly monthly. No product announcements, no drip sequence."
        primary={{ label: "Subscribe", href: "/contact" }}
        secondary={{ label: "About us", href: "/about" }}
      />
    </>
  );
}
