import { apiClient } from "./client";
import type { LogEntry, LogLevel } from "../types";

export async function getLogsForService(
  serviceId: string,
  params?: { level?: LogLevel; limit?: number }
): Promise<LogEntry[]> {
  const res = await apiClient.get(`/logs/${serviceId}`, {
    params,
  });

  return res.data.map((l: any) => ({
    id: l.id,
    serviceId: l.service_id,
    timestamp: l.timestamp,
    level: l.level,
    message: l.message,
    traceId: l.trace_id,
  })) as LogEntry[];
}
