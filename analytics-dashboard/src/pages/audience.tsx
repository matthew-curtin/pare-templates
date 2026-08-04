import { PageHeader } from "@/components/app-shell";
import { ChartCard, DataTable } from "@/components/chart/chart-card";
import { Heatmap } from "@/components/chart/heatmap";
import { cohortNote, cohorts, planMix } from "@/content/breakdowns";
import { withCommas } from "@/lib/format";

/** The tier the plan-mix chart deliberately leaves out, so the number
 *  still exists somewhere on the site. */
const ENTERPRISE = { name: "Enterprise", teams: 24, note: "Invoiced annually" };

export function AudiencePage() {
  const rows = [
    ...planMix.map((slice) => ({ ...slice, note: "Self-serve" })),
    ENTERPRISE,
  ];
  const total = rows.reduce((sum, row) => sum + row.teams, 0);

  return (
    <>
      <PageHeader
        title="Audience"
        description="Who is here, and whether they come back."
      />

      <div className="space-y-5 p-6">
        <ChartCard
          title="Weekly retention"
          subtitle="Teams still sending events, by the week they arrived"
          note={cohortNote}
          table={
            <DataTable
              columns={["Cohort", "Teams", "Week 1", "Week 2", "Week 4"]}
              align={["left", "right", "right", "right", "right"]}
              rows={cohorts.map((cohort) => [
                cohort.label,
                withCommas(cohort.size),
                cohort.values[1] === undefined
                  ? "—"
                  : `${Math.round(cohort.values[1] * 100)}%`,
                cohort.values[2] === undefined
                  ? "—"
                  : `${Math.round(cohort.values[2] * 100)}%`,
                cohort.values[4] === undefined
                  ? "—"
                  : `${Math.round(cohort.values[4] * 100)}%`,
              ])}
            />
          }
        >
          <Heatmap cohorts={cohorts} />
        </ChartCard>

        <section className="rounded-xl border border-line bg-surface p-5">
          <h2 className="font-semibold text-ink">Teams by plan</h2>
          <p className="mt-0.5 text-sm text-ink-subtle">
            Including the tier too small to draw on the overview.
          </p>

          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="py-2 pr-4 text-left font-semibold text-ink-muted">
                  Plan
                </th>
                <th scope="col" className="py-2 pr-4 text-left font-semibold text-ink-muted">
                  Billing
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-semibold text-ink-muted">
                  Teams
                </th>
                <th scope="col" className="py-2 text-right font-semibold text-ink-muted">
                  Share
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name} className="border-b border-line last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-ink">{row.name}</td>
                  <td className="py-2.5 pr-4 text-ink-muted">{row.note}</td>
                  <td className="tnum py-2.5 pr-4 text-right">
                    {withCommas(row.teams)}
                  </td>
                  <td className="tnum py-2.5 text-right text-ink-muted">
                    {((row.teams / total) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
