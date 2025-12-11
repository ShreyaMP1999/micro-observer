import type { Alert } from "../../types";
import { Badge } from "../common/Badge";

interface Props {
  alerts: Alert[];
  onAcknowledge?: (alertId: string) => void;
}

function severityVariant(sev: Alert["severity"]) {
  if (sev === "critical") return "danger";
  if (sev === "high") return "warning";
  if (sev === "medium") return "info";
  return "success";
}

export function AlertList({ alerts, onAcknowledge }: Props) {
  if (!alerts.length) {
    return <div className="panel__empty">No alerts 🎉</div>;
  }

  return (
    <ul className="alert-list">
      {alerts.map((a) => (
        <li key={a.id} className="alert-list__item">
          <div className="alert-list__top">
            <Badge variant={severityVariant(a.severity)}>{a.severity}</Badge>
            <span className="alert-list__service">{a.serviceId}</span>
            <span className="alert-list__metric">{a.metric}</span>
            <span className="alert-list__time">
              {new Date(a.triggeredAt).toLocaleString()}
            </span>
          </div>

          <div className="alert-list__bottom">
            <div className="alert-list__msg">{a.message}</div>

            {!a.acknowledged && onAcknowledge && (
              <button
                type="button"
                className="alert-list__ack-btn"
                onClick={() => onAcknowledge(a.id)}
              >
                Acknowledge
              </button>
            )}
            {a.acknowledged && (
              <span className="alert-list__ack-label">acknowledged</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
