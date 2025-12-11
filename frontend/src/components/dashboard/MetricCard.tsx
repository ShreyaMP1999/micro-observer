interface Props {
    label: string;
    value: number | string;
    highlight?: boolean;
  }
  
  export function MetricCard({ label, value, highlight }: Props) {
    return (
      <div className={`metric-card ${highlight ? "metric-card--highlight" : ""}`}>
        <div className="metric-card__label">{label}</div>
        <div className="metric-card__value">{value}</div>
      </div>
    );
  }
  