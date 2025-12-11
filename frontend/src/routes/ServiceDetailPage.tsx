import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { LogEntry, MetricSnapshot, Service } from "../types";
import { getServiceById } from "../api/serviceApi";
import { getMetricsForService } from "../api/metricsApi";
import { getLogsForService } from "../api/logsApi";
import { ServiceHeader } from "../components/service/ServiceHeader";
import { MetricsOverview } from "../components/service/MetricsOverview";
import { LogsPanel } from "../components/service/LogsPanel";
import { Spinner } from "../components/common/Spinner";
import { ErrorState } from "../components/common/ErrorState";

export function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [metrics, setMetrics] = useState<MetricSnapshot[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) return;
    async function load() {
      try {
        setError(null);
        setLoading(true);
        const [svc, met, lg] = await Promise.all([
          getServiceById(serviceId),
          getMetricsForService(serviceId),
          getLogsForService(serviceId, { limit: 50 }),
        ]);
        setService(svc);
        setMetrics(met);
        setLogs(lg);
      } catch (e: any) {
        setError(e.message ?? "Failed to load service");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [serviceId]);

  if (loading && !service) return <Spinner />;
  if (error || !service) return <ErrorState message={error ?? "Service not found"} />;

  return (
    <div className="page">
      <ServiceHeader service={service} />
      <MetricsOverview snapshots={metrics} />
      <LogsPanel logs={logs} />
    </div>
  );
}
