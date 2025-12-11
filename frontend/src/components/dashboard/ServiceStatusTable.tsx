import { Link } from "react-router-dom";
import type { Service } from "../../types";
import { Badge } from "../common/Badge";

interface Props {
  services: Service[];
}

function statusVariant(status: Service["status"]) {
  if (status === "healthy") return "success";
  if (status === "degraded") return "warning";
  return "danger";
}

export function ServiceStatusTable({ services }: Props) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Service</th>
          <th>Owner</th>
          <th>Status</th>
          <th>Uptime (24h)</th>
          <th>Last heartbeat</th>
        </tr>
      </thead>
      <tbody>
        {services.map((s) => (
          <tr key={s.id}>
          <td>
            <Link to={`/services/${s.id}`} className="link">
              {s.name}
            </Link>
          </td>
          <td>{s.owner ?? "-"}</td>
          <td>
            <Badge variant={statusVariant(s.status)}>{s.status}</Badge>
          </td>
          <td>{s.uptimePercentage.toFixed(2)}%</td>
          <td>{new Date(s.lastHeartbeat).toLocaleTimeString()}</td>
        </tr>        
        ))}
      </tbody>
    </table>
  );
}
