import { useCallback, useState } from "react";
import type { Alert, Service, ServiceHealthSummary } from "../types";
import { getHealthSummary, getRecentAlerts, getServices } from "../api/serviceApi";
import { MetricCard } from "../components/dashboard/MetricCard";
import { ServiceStatusTable } from "../components/dashboard/ServiceStatusTable";
import { AlertsSummary } from "../components/dashboard/AlertsSummary";
import { Spinner } from "../components/common/Spinner";
import { ErrorState } from "../components/common/ErrorState";
import { usePolling } from "../hooks/usePolling";

export function DashboardPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [summary, setSummary] = useState<ServiceHealthSummary | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [svc, sum, al] = await Promise.all([
        getServices(),
        getHealthSummary(),
        getRecentAlerts(5),
      ]);
      setServices(svc);
      setSummary(sum);
      setAlerts(al);
      setLoading(false);
    } catch (e: any) {
      setError(e.message ?? "Failed to load dashboard");
      setLoading(false);
    }
  }, []);

  usePolling(loadData, 5000);

  if (loading && !summary) return <Spinner />;
  if (error || !summary) return <ErrorState message={error ?? "No data"} />;

  return (
    <div className="page">
      <h1>System Overview</h1>
      <div className="dashboard-metrics">
        <MetricCard label="Total services" value={summary.totalServices} />
        <MetricCard label="Healthy" value={summary.healthyCount} />
        <MetricCard label="Degraded" value={summary.degradedCount} />
        <MetricCard label="Down" value={summary.downCount} />
        <MetricCard label="Open alerts" value={summary.openAlertsCount} highlight />
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-layout__main">
          <ServiceStatusTable services={services} />
        </div>
        <div className="dashboard-layout__side">
          <AlertsSummary alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
