import { PageHeader } from "@/components/app-shell";
import { BarChart } from "@/components/chart/bar-chart";
import { ChartCard, DataTable, Legend } from "@/components/chart/chart-card";
import { StackedBar } from "@/components/chart/stacked-bar";
import { TimeSeries } from "@/components/chart/time-series";
import { RangePicker } from "@/components/range-picker";
import { StatTile } from "@/components/stat-tile";
import { planMix, sources } from "@/content/breakdowns";
import {
  incidentNote,
  kpis,
  previousSliceFor,
  sliceFor,
} from "@/content/metrics";
import { computeKpis } from "@/lib/derive";
import { compact, shortDate, withCommas } from "@/lib/format";
import { useRange } from "@/lib/use-range";

export function OverviewPage() {
  const [range, setRange] = useRange();

  // Every number on this page comes from these two slices, so moving
  // the range moves the whole dashboard rather than one card.
  const current = sliceFor(range.days);
  const previous = previousSliceFor(range.days);
  const hasComparison = previous.length === current.length;

  const values = computeKpis(kpis, current, previous);
  const comparisonLabel = `previous ${range.days} days`;

  const eventSeries = current.map((point) => ({
    date: point.date,
    value: point.events,
  }));
  const previousEvents = hasComparison ? previous.map((p) => p.events) : null;

  const totalTeams = planMix.reduce((sum, slice) => sum + slice.teams, 0);
  const totalSessions = sources.reduce((sum, s) => sum + s.sessions, 0);

  return (
    <>
      <PageHeader
        title="Overview"
        description="Everything on this page is scoped to the range on the right."
        actions={<RangePicker value={range} onChange={setRange} />}
      />

      <div className="space-y-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {values.map((item) => (
            <StatTile
              key={item.kpi.id}
              item={item}
              comparisonLabel={comparisonLabel}
            />
          ))}
        </div>

        <ChartCard
          title="Events over time"
          subtitle={`${shortDate(current[0].date)} – ${shortDate(
            current[current.length - 1].date
          )}`}
          note={
            range.days >= 60
              ? `${incidentNote.title}. ${incidentNote.body}`
              : undefined
          }
          toolbar={
            hasComparison ? (
              <Legend
                items={[
                  { label: "This period", color: "var(--color-series-1)" },
                  {
                    label: comparisonLabel,
                    color: "var(--color-series-muted)",
                    muted: true,
                  },
                ]}
              />
            ) : undefined
          }
          table={
            <DataTable
              columns={["Date", "Events", "Sessions", "Median session"]}
              align={["left", "right", "right", "right"]}
              rows={current
                .slice()
                .reverse()
                .map((point) => [
                  shortDate(point.date),
                  withCommas(point.events),
                  withCommas(point.sessions),
                  `${Math.round(point.medianSeconds)}s`,
                ])}
            />
          }
        >
          <TimeSeries
            current={eventSeries}
            previous={previousEvents}
            label="This period"
            previousLabel={comparisonLabel}
            formatValue={compact}
          />
        </ChartCard>

        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard
            title="Where sessions come from"
            subtitle="All time"
            table={
              <DataTable
                columns={["Source", "Sessions", "Share"]}
                align={["left", "right", "right"]}
                rows={sources.map((source) => [
                  source.name,
                  withCommas(source.sessions),
                  `${((source.sessions / totalSessions) * 100).toFixed(1)}%`,
                ])}
              />
            }
          >
            <BarChart
              data={sources.map((s) => ({ name: s.name, value: s.sessions }))}
              valueLabel="sessions"
            />
          </ChartCard>

          <ChartCard
            title="Plan mix"
            subtitle={`${withCommas(totalTeams)} teams with at least one event`}
            note="Enterprise is not shown: at 24 teams it is a sliver too thin to label, and it has its own row in the audience table."
            table={
              <DataTable
                columns={["Plan", "Teams", "Share"]}
                align={["left", "right", "right"]}
                rows={planMix.map((slice) => [
                  slice.name,
                  withCommas(slice.teams),
                  `${((slice.teams / totalTeams) * 100).toFixed(1)}%`,
                ])}
              />
            }
          >
            <StackedBar
              data={planMix.map((p) => ({ name: p.name, value: p.teams }))}
              unit="teams"
            />
          </ChartCard>
        </div>
      </div>
    </>
  );
}
