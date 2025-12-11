import type { MetricSnapshot } from "../../types";

interface Props {
  snapshots: MetricSnapshot[];
}

/**
 * Very simple "chart": shows CPU usage as bars.
 */
export function UptimeTimeline({ snapshots }: Props) {
  if (!snapshots.length) return null;

  return (
    <div className="timeline">
      {snapshots.map((m) => (
        <div key={m.id} className="timeline__item">
          <div
            className="timeline__bar"
            style={{ height: `${m.cpuUsage}%` }}
            title={`${new Date(m.timestamp).toLocaleTimeString()} - ${m.cpuUsage.toFixed(
              1
            )}% CPU`}
          />
        </div>
      ))}
    </div>
  );
}
