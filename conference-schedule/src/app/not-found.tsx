import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 py-24 sm:px-6">
      <p className="narrow text-[0.875rem] uppercase tracking-wide text-ink-subtle">
        404
      </p>
      <h1 className="sign mt-4 text-display">Nothing scheduled here</h1>
      <p className="prose-block mt-5 text-lede leading-snug text-ink-muted">
        The page you asked for does not exist. The wallchart does, and it
        has everything on it.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/schedule"
          className="focus-ring wide bg-ink px-5 py-3 text-[1rem] font-semibold text-ink-inverse transition-colors hover:bg-ink/85"
        >
          Open the schedule
        </Link>
        <Link
          href="/"
          className="focus-ring wide border border-ink px-5 py-3 text-[1rem] font-semibold transition-colors hover:bg-live"
        >
          Back to the front
        </Link>
      </div>
    </div>
  );
}
