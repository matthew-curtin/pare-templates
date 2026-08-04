import { Link, useParams } from "react-router-dom";
import { PageHeader } from "@/components/app-shell";
import { ChartCard, DataTable } from "@/components/chart/chart-card";
import { TimeSeries } from "@/components/chart/time-series";
import { KIND_LABEL, getEvent } from "@/content/events";
import { daily } from "@/content/metrics";
import { compact, dateTime, signedPercent, withCommas } from "@/lib/format";

export function EventDetailPage() {
  const { id } = useParams();
  const event = id ? getEvent(id) : undefined;

  if (!event) {
    return (
      <>
        <PageHeader title="Event not found" />
        <div className="p-6">
          <p className="text-ink-muted">
            No event with that name.{" "}
            <Link to="/events" className="font-medium text-accent hover:underline">
              Back to all events
            </Link>
            .
          </p>
        </div>
      </>
    );
  }

  // The sparkline's 14 points, dated against the end of the series so
  // the axis says something real.
  const dates = daily.slice(-event.trend.length).map((point) => point.date);
  const series = event.trend.map((value, i) => ({
    date: dates[i],
    // The stored trend is in hundreds; scale it to the event's own
    // volume so the axis matches the headline number.
    value: Math.round((value / 100) * (event.volume / 30)),
  }));

  const facts = [
    { term: "Kind", value: KIND_LABEL[event.kind] },
    { term: "Owner", value: event.owner },
    { term: "Teams sending", value: withCommas(event.teams) },
    { term: "Last seen", value: dateTime(event.lastSeen) },
  ];

  return (
    <>
      <PageHeader
        title={event.name}
        description={event.description}
        actions={
          <Link
            to="/events"
            className="rounded-lg border border-line-strong px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:border-accent hover:text-accent"
          >
            ← All events
          </Link>
        }
      />

      <div className="space-y-5 p-6">
        {/* Five tiles, so the wide breakpoint is five columns. A
            four-column grid strands the last one alone on its own row. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="text-sm text-ink-muted">Volume, last 30 days</p>
            <p className="mt-2 text-3xl leading-none font-semibold">
              {compact(event.volume)}
            </p>
            <p className="mt-3 text-xs">
              <span
                className="font-semibold"
                style={{
                  color:
                    (event.kind === "error") === event.changePercent > 0
                      ? "var(--color-critical)"
                      : "var(--color-good-text)",
                }}
              >
                {event.changePercent > 0 ? "↑" : "↓"}{" "}
                {signedPercent(event.changePercent)}
              </span>
              <span className="ml-1.5 text-ink-subtle">vs previous 30 days</span>
            </p>
          </div>

          {facts.map((fact) => (
            <div
              key={fact.term}
              className="rounded-xl border border-line bg-surface p-4"
            >
              <p className="text-sm text-ink-muted">{fact.term}</p>
              <p className="mt-2 text-lg font-semibold text-ink">{fact.value}</p>
            </div>
          ))}
        </div>

        <ChartCard
          title="Daily volume"
          subtitle="Last 14 days"
          table={
            <DataTable
              columns={["Date", "Events"]}
              align={["left", "right"]}
              rows={series
                .slice()
                .reverse()
                .map((point) => [point.date, withCommas(point.value)])}
            />
          }
        >
          <TimeSeries
            current={series}
            previous={null}
            label={event.name}
            previousLabel="previous period"
            formatValue={compact}
          />
        </ChartCard>
      </div>
    </>
  );
}
