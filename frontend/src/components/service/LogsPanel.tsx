import type { LogEntry } from "../../types";
import { Badge } from "../common/Badge";

interface Props {
  logs: LogEntry[];
}

function levelVariant(level: LogEntry["level"]) {
  if (level === "ERROR") return "danger";
  if (level === "WARN") return "warning";
  return "info";
}

export function LogsPanel({ logs }: Props) {
  return (
    <div className="panel">
      <div className="panel__header">
        <h3>Recent Logs</h3>
      </div>
      {logs.length === 0 ? (
        <div className="panel__empty">No logs yet.</div>
      ) : (
        <ul className="logs">
          {logs.map((log) => (
            <li key={log.id} className="logs__item">
              <span className="logs__time">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <Badge variant={levelVariant(log.level)}>{log.level}</Badge>
              <span className="logs__msg">{log.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
