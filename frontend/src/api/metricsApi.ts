import { apiClient } from "./client";
import type { MetricSnapshot } from "../types";

export async function getMetricsForService(
  serviceId: string,
  limit = 50
): Promise<MetricSnapshot[]> {
  const res = await apiClient.get(`/metrics/${serviceId}`, {
    params: { limit },
  });

  return res.data.map((m: any) => ({
    id: m.id,
    serviceId: m.service_id,
    timestamp: m.timestamp,
    cpuUsage: m.cpu_usage,
    memoryUsage: m.memory_usage,
    requestRate: m.request_rate,
    errorRate: m.error_rate,
  })) as MetricSnapshot[];
}

export async function getLatestMetricsForService(
  serviceId: string
): Promise<MetricSnapshot | null> {
  const res = await apiClient.get(`/metrics/${serviceId}/latest`);
  if (!res.data) return null;
  const m = res.data;
  return {
    id: m.id,
    serviceId: m.service_id,
    timestamp: m.timestamp,
    cpuUsage: m.cpu_usage,
    memoryUsage: m.memory_usage,
    requestRate: m.request_rate,
    errorRate: m.error_rate,
  };
}
