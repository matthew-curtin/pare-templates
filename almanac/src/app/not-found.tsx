import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="label text-ink-subtle">404</p>
      <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight">
        Nothing at that address
      </h1>
      <p className="mt-3 leading-relaxed text-ink-muted">
        If you followed a link to a vacancy, it may have been mistyped —
        closed vacancies keep their pages here, so a link that worked
        once should still work.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link
          href="/"
          className="focus-ring rounded-sm bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent hover:bg-accent-hover"
        >
          All vacancies
        </Link>
        <Link
          href="/employers"
          className="focus-ring rounded-sm border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-line-strong"
        >
          Employers
        </Link>
      </div>
    </div>
  );
}
