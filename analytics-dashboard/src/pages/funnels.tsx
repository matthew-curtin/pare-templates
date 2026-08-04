import { PageHeader } from "@/components/app-shell";
import { ChartCard, DataTable } from "@/components/chart/chart-card";
import { FunnelChart } from "@/components/chart/funnel-chart";
import { funnel, funnelNote } from "@/content/breakdowns";
import { withCommas } from "@/lib/format";

export function FunnelsPage() {
  const first = funnel[0].teams;

  return (
    <>
      <PageHeader
        title="Funnels"
        description="Activation, from signing up to coming back a second week."
      />

      <div className="space-y-5 p-6">
        <ChartCard
          title="Activation"
          subtitle="Teams that signed up in the last 90 days"
          note={funnelNote}
          table={
            <DataTable
              columns={["Stage", "Teams", "Of signups", "Dropped here"]}
              align={["left", "right", "right", "right"]}
              rows={funnel.map((stage, i) => [
                stage.name,
                withCommas(stage.teams),
                `${((stage.teams / first) * 100).toFixed(1)}%`,
                i === 0
                  ? "—"
                  : withCommas(funnel[i - 1].teams - stage.teams),
              ])}
            />
          }
        >
          <FunnelChart stages={funnel} />
        </ChartCard>
      </div>
    </>
  );
}
