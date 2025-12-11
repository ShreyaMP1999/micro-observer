export type ServiceStatus = "healthy" | "degraded" | "down";

export interface Service {
  id: string;
  name: string;
  owner?: string | null;
  status: ServiceStatus;
  uptimePercentage: number;
  lastHeartbeat: string; // ISO string
}

export interface ServiceHealthSummary {
  totalServices: number;
  healthyCount: number;
  degradedCount: number;
  downCount: number;
  openAlertsCount: number;
}

export interface MetricSnapshot {
  id: number;
  serviceId: string;
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  requestRate: number;
  errorRate: number;
}

export type LogLevel = "INFO" | "WARN" | "ERROR";

export interface LogEntry {
  id: string;
  serviceId: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  traceId?: string;
}

export type AlertSeverity = "low" | "medium" | "high" | "critical";

export interface Alert {
  id: string;
  serviceId: string;
  metric: "cpu" | "memory" | "errorRate" | "uptime" | string;
  severity: AlertSeverity;
  message: string;
  triggeredAt: string;
  resolvedAt?: string | null;
  acknowledged: boolean;
}
