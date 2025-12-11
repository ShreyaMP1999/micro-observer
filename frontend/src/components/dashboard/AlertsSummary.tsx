import type { Alert } from "../../types";
import { Badge } from "../common/Badge";

interface Props {
  alerts: Alert[];
}

function severityVariant(sev: Alert["severity"]) {
  if (sev === "critical") return "danger";
  if (sev === "high") return "warning";
  if (sev === "medium") return "info";
  return "success";
}

export function AlertsSummary({ alerts }: Props) {
  if (!alerts.length) {
    return <div className="panel">No recent alerts 🎉</div>;
  }

  return (
    <div className="panel">
      <div className="panel__header">
        <h3>Recent Alerts</h3>
      </div>
      <ul className="alert-list">
        {alerts.map((a) => (
          <li key={a.id} className="alert-list__item">
            <div className="alert-list__top">
              <Badge variant={severityVariant(a.severity)}>{a.severity}</Badge>
              <span className="alert-list__service">{a.serviceId}</span>
              <span className="alert-list__time">
                {new Date(a.triggeredAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="alert-list__msg">{a.message}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
