import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold text-ink-subtle">404</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Nothing at that address
      </h1>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-muted">
        If you followed a link to a job, it may have been mistyped — closed
        postings keep their pages here, so a link that worked once should
        still work.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Link
          href="/"
          className="focus-ring rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
        >
          All jobs
        </Link>
        <Link
          href="/employers"
          className="focus-ring rounded-lg bg-sunk px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-line"
        >
          Employers
        </Link>
      </div>
    </div>
  );
}
