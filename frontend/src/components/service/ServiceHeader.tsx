import type { Service } from "../../types";
import { Badge } from "../common/Badge";

interface Props {
  service: Service;
}

function statusVariant(status: Service["status"]) {
  if (status === "healthy") return "success";
  if (status === "degraded") return "warning";
  return "danger";
}

export function ServiceHeader({ service }: Props) {
  return (
    <div className="service-header">
      <div>
        <h1>{service.name}</h1>
        <div className="service-header__meta">
          <span>ID: {service.id}</span>
          {service.owner && <span>Owner: {service.owner}</span>}
        </div>
      </div>
      <div className="service-header__status">
        <Badge variant={statusVariant(service.status)}>{service.status}</Badge>
        <div className="service-header__uptime">
          Uptime (24h): {service.uptimePercentage.toFixed(2)}%
        </div>
        <div className="service-header__heartbeat">
          Last heartbeat:{" "}
          {new Date(service.lastHeartbeat).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
