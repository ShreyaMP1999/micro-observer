import type { MetricSnapshot } from "../../types";
import { PanelSection } from "./PanelSections";
import { CpuChart } from "./CpuChart";

interface MetricsOverviewProps {
  snapshots: MetricSnapshot[];
}

/**
 * Shows the latest metrics + a chart over time.
 */
export function MetricsOverview({ snapshots }: MetricsOverviewProps) {
  if (!snapshots.length) {
    return <div className="panel">No metrics yet.</div>;
  }

  // Sort by time (oldest -> newest)
  const sorted = [...snapshots].sort(
    (a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const latest = sorted[sorted.length - 1];

  return (
    <div className="metrics-overview">
      {/* Top row: current metric values */}
      <PanelSection title="Current Metrics">
        <div className="metrics-overview__grid">
          <div>
            <div className="metrics-overview__label">CPU usage</div>
            <div className="metrics-overview__value">
              {latest.cpuUsage.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="metrics-overview__label">Memory usage</div>
            <div className="metrics-overview__value">
              {latest.memoryUsage.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="metrics-overview__label">Requests / sec</div>
            <div className="metrics-overview__value">
              {latest.requestRate.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="metrics-overview__label">Errors / min</div>
            <div className="metrics-overview__value">
              {latest.errorRate.toFixed(2)}
            </div>
          </div>
        </div>
      </PanelSection>

      {/* Bottom: CPU + memory chart */}
      <PanelSection title="CPU & memory over time">
        <CpuChart snapshots={sorted} />
      </PanelSection>
    </div>
  );
}
