from datetime import datetime
from enum import Enum
from pydantic import BaseModel


class ServiceStatus(str, Enum):
    healthy = "healthy"
    degraded = "degraded"
    down = "down"


class Service(BaseModel):
    id: str
    name: str
    owner: str | None = None
    status: ServiceStatus
    uptime_percentage: float
    last_heartbeat: datetime


class MetricSnapshot(BaseModel):
    service_id: str
    timestamp: datetime
    cpu_usage: float
    memory_usage: float
    request_rate: float
    error_rate: float


class LogLevel(str, Enum):
    info = "INFO"
    warn = "WARN"
    error = "ERROR"


class LogEntry(BaseModel):
    id: str
    service_id: str
    timestamp: datetime
    level: LogLevel
    message: str
    trace_id: str | None = None


class AlertSeverity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class Alert(BaseModel):
    id: str
    service_id: str
    metric: str
    severity: AlertSeverity
    message: str
    triggered_at: datetime
    resolved_at: datetime | None = None
    acknowledged: bool = False


class ServiceHealthSummary(BaseModel):
    total_services: int
    healthy_count: int
    degraded_count: int
    down_count: int
    open_alerts_count: int
