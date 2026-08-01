/**
 * A stylised screenshot of the product, built in HTML and CSS rather
 * than shipped as an image. It stays sharp at any size, weighs nothing,
 * and every part of it can be edited directly.
 */

const weeks = [
  { label: "W22", review: 38, build: 26, deploy: 12 },
  { label: "W23", review: 44, build: 24, deploy: 14 },
  { label: "W24", review: 52, build: 28, deploy: 11 },
  { label: "W25", review: 41, build: 22, deploy: 10 },
  { label: "W26", review: 33, build: 25, deploy: 9 },
  { label: "W27", review: 27, build: 21, deploy: 8 },
  { label: "W28", review: 22, build: 20, deploy: 8 },
];

/** Tallest bar in the chart, in pixels. */
const CHART_HEIGHT = 112;

const rows = [
  { title: "Rework the billing webhook", stage: "In review", age: "2d", risk: "high" },
  { title: "Add SCIM group sync", stage: "In progress", age: "4h", risk: "low" },
  { title: "Fix timezone bucketing", stage: "Merged", age: "1d", risk: "low" },
];

export function AppMockup() {
  const max = Math.max(...weeks.map((w) => w.review + w.build + w.deploy));

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-canvas shadow-2xl shadow-ink/10">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <div className="mx-auto rounded-md bg-canvas px-3 py-1 text-[11px] text-ink-subtle">
          app.cadence.example/teams/platform
        </div>
      </div>

      <div className="grid sm:grid-cols-[150px_1fr]">
        {/* Sidebar */}
        <aside className="hidden border-r border-line bg-surface p-4 sm:block">
          <p className="text-[10px] font-semibold tracking-wide text-ink-subtle uppercase">
            Teams
          </p>
          <ul className="mt-3 space-y-1.5">
            {["Platform", "Payments", "Growth", "Mobile"].map((t, i) => (
              <li
                key={t}
                className={
                  i === 0
                    ? "rounded-md bg-accent-soft px-2 py-1.5 text-xs font-medium text-accent"
                    : "px-2 py-1.5 text-xs text-ink-muted"
                }
              >
                {t}
              </li>
            ))}
          </ul>
        </aside>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold">Platform · last 7 weeks</h3>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
              ↓ 31% cycle time
            </span>
          </div>

          {/* KPI row */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Cycle time", value: "4.1d" },
              { label: "Review wait", value: "9h" },
              { label: "Deploys / wk", value: "23" },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-lg border border-line px-3 py-2.5"
              >
                <p className="text-[10px] text-ink-subtle">{kpi.label}</p>
                <p className="mt-0.5 text-lg font-semibold tracking-tight">
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          {/* Stacked bar chart.
              Heights are computed in pixels rather than percentages: a
              percentage height needs a parent with a definite height, and
              inside a flex column it silently collapses to nothing. */}
          <div className="mt-5 flex items-end gap-2">
            {weeks.map((w) => {
              const total = w.review + w.build + w.deploy;
              const barHeight = (total / max) * CHART_HEIGHT;
              const segments = [
                { key: "review", value: w.review, className: "bg-accent" },
                { key: "build", value: w.build, className: "bg-accent/55" },
                { key: "deploy", value: w.deploy, className: "bg-accent/25" },
              ];
              return (
                <div key={w.label} className="flex flex-1 flex-col items-center">
                  <div
                    className="flex w-full flex-col overflow-hidden rounded-t-sm"
                    style={{ height: `${barHeight}px` }}
                  >
                    {segments.map((segment) => (
                      <div
                        key={segment.key}
                        className={segment.className}
                        style={{
                          height: `${(segment.value / total) * barHeight}px`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="mt-1.5 text-[9px] text-ink-subtle">
                    {w.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Table */}
          <div className="mt-5 overflow-hidden rounded-lg border border-line">
            {rows.map((row, i) => (
              <div
                key={row.title}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    row.risk === "high" ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                />
                <span className="flex-1 truncate text-ink">{row.title}</span>
                <span className="hidden text-ink-subtle sm:inline">
                  {row.stage}
                </span>
                <span className="w-8 text-right text-ink-subtle">
                  {row.age}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
