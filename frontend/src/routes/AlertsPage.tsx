import { useEffect, useState } from "react";
import type { Alert } from "../types";
import { listAlerts, acknowledgeAlert } from "../api/alertsApi";
import { AlertFilters } from "../components/alerts/AlertFilters";
import { AlertList } from "../components/alerts/AlertList";
import { Spinner } from "../components/common/Spinner";
import { ErrorState } from "../components/common/ErrorState";

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [onlyOpen, setOnlyOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAlerts(currentOnlyOpen = onlyOpen) {
    try {
      setError(null);
      setLoading(true);
      const data = await listAlerts(currentOnlyOpen);
      setAlerts(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyOpen]);

  async function handleAcknowledge(id: string) {
    try {
      await acknowledgeAlert(id);
      // reload list (respects the current "onlyOpen" toggle)
      await loadAlerts();
    } catch (e: any) {
      setError(e.message ?? "Failed to acknowledge alert");
    }
  }

  return (
    <div className="page">
      <h1>Alerts</h1>
      <AlertFilters onlyOpen={onlyOpen} onChangeOnlyOpen={setOnlyOpen} />

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <div className="panel">
          <AlertList alerts={alerts} onAcknowledge={handleAcknowledge} />
        </div>
      )}
    </div>
  );
}
