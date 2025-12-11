import { apiClient } from "./client";
import type { Service, ServiceHealthSummary, Alert } from "../types";

export async function getServices(): Promise<Service[]> {
  const res = await apiClient.get("/services");
  // map snake_case to camelCase
  return res.data.map((s: any) => ({
    id: s.id,
    name: s.name,
    owner: s.owner,
    status: s.status,
    uptimePercentage: s.uptime_percentage,
    lastHeartbeat: s.last_heartbeat,
  })) as Service[];
}

export async function getServiceById(id: string): Promise<Service> {
  const res = await apiClient.get(`/services/${id}`);
  const s = res.data;
  return {
    id: s.id,
    name: s.name,
    owner: s.owner,
    status: s.status,
    uptimePercentage: s.uptime_percentage,
    lastHeartbeat: s.last_heartbeat,
  };
}

export async function getHealthSummary(): Promise<ServiceHealthSummary> {
  const res = await apiClient.get("/services/summary");
  const d = res.data;
  return {
    totalServices: d.total_services,
    healthyCount: d.healthy_count,
    degradedCount: d.degraded_count,
    downCount: d.down_count,
    openAlertsCount: d.open_alerts_count,
  };
}

export async function getRecentAlerts(limit = 5): Promise<Alert[]> {
  const res = await apiClient.get("/alerts/recent", { params: { limit } });
  return res.data.map((a: any) => ({
    id: a.id,
    serviceId: a.service_id,
    metric: a.metric,
    severity: a.severity,
    message: a.message,
    triggeredAt: a.triggered_at,
    resolvedAt: a.resolved_at,
    acknowledged: a.acknowledged,
  })) as Alert[];
}
