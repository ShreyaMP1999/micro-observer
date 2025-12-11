// import { apiClient } from "./client";
// import type { Alert } from "../types";

// export async function listAlerts(onlyOpen: boolean): Promise<Alert[]> {
//   const res = await apiClient.get("/alerts", {
//     params: { only_open: onlyOpen },
//   });

//   return res.data.map((a: any) => ({
//     id: a.id,
//     serviceId: a.service_id,
//     metric: a.metric,
//     severity: a.severity,
//     message: a.message,
//     triggeredAt: a.triggered_at,
//     resolvedAt: a.resolved_at,
//     acknowledged: a.acknowledged,
//   })) as Alert[];
// }

// export async function acknowledgeAlert(alertId: string): Promise<Alert> {
//   const res = await apiClient.post(`/alerts/${alertId}/acknowledge`);
//   const a = res.data;
//   return {
//     id: a.id,
//     serviceId: a.service_id,
//     metric: a.metric,
//     severity: a.severity,
//     message: a.message,
//     triggeredAt: a.triggered_at,
//     resolvedAt: a.resolved_at,
//     acknowledged: a.acknowledged,
//   };
// }

import { apiClient } from "./client";
import type { Alert } from "../types";

function mapAlert(a: any): Alert {
  return {
    id: a.id,
    serviceId: a.service_id,
    metric: a.metric,
    severity: a.severity,
    message: a.message,
    triggeredAt: a.triggered_at,
    resolvedAt: a.resolved_at,
    acknowledged: a.acknowledged,
  };
}

export async function listAlerts(onlyOpen: boolean): Promise<Alert[]> {
  const res = await apiClient.get("/alerts", {
    params: { only_open: onlyOpen },
  });
  return res.data.map(mapAlert);
}

export async function acknowledgeAlert(alertId: string): Promise<Alert> {
  const res = await apiClient.post(`/alerts/${alertId}/acknowledge`);
  return mapAlert(res.data);
}
