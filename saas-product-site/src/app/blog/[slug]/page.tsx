import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { PostBody } from "@/components/post-body";
import { Avatar } from "@/components/avatar";
import { CtaBand } from "@/components/cta-band";
import { getPost, posts } from "@/content/posts";
import { formatDate } from "@/lib/format";

type Params = { slug: string };

/** Pre-renders every post at build time. */
export function generateStaticParams(): Params[] {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <Container width="narrow">
        <article className="py-16 sm:py-20">
          <Link
            href="/blog"
            className="text-sm text-ink-muted transition-colors hover:text-ink"
          >
            ← All posts
          </Link>

          <p className="mt-10 text-sm font-medium text-accent uppercase">
            {post.category}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-ink-muted">
            {post.excerpt}
          </p>

          <div className="mt-8 flex items-center gap-3 border-y border-line py-5">
            <Avatar name={post.author.name} size="sm" />
            <div className="text-sm">
              <p className="font-medium">{post.author.name}</p>
              <p className="text-ink-subtle">{post.author.role}</p>
            </div>
            <p className="ml-auto text-sm text-ink-subtle">
              {formatDate(post.date)} · {post.readingMinutes} min read
            </p>
          </div>

          <div className="relative my-10 aspect-[16/9] overflow-hidden rounded-xl bg-surface">
            <Image
              src={post.cover}
              alt={post.coverAlt}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>

          <PostBody blocks={post.body} />
        </article>
      </Container>

      {/* More posts */}
      <Container>
        <div className="border-t border-line py-16">
          <h2 className="text-xl font-semibold tracking-tight">
            More from the blog
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {more.map((other) => (
              <Link
                key={other.slug}
                href={`/blog/${other.slug}`}
                className="group"
              >
                <p className="text-xs font-medium text-accent uppercase">
                  {other.category}
                </p>
                <h3 className="mt-2 font-semibold text-balance group-hover:text-accent">
                  {other.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
                  {other.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </Container>

      <CtaBand />
    </>
  );
}
