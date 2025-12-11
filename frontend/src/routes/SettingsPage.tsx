export function SettingsPage() {
    return (
      <div className="page">
        <h1>Settings</h1>
        <p>
          This is a demo system, so there aren&apos;t many configurable
          settings yet. In a real production version, you could configure:
        </p>
        <ul>
          <li>Alert thresholds (CPU, memory, error rate)</li>
          <li>Notification channels (Slack, email, etc.)</li>
          <li>Service ownership and tags</li>
        </ul>
      </div>
    );
  }
  