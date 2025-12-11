import asyncio
import random
from datetime import datetime
from uuid import uuid4

from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import Service, MetricSample, Log, Alert


SERVICE_DEFS = [
    ("auth-service", "Auth Service", "Platform Team"),
    ("payments-service", "Payments Service", "Payments Team"),
    ("notifications-service", "Notifications Service", "Messaging Team"),
    ("analytics-service", "Analytics Service", "Data Team"),
]


CPU_ALERT_THRESHOLD = 85.0
ERROR_RATE_ALERT_THRESHOLD = 5.0


def _bootstrap_services(db: Session) -> None:
    """Create the default services if they don't exist yet."""
    for sid, name, owner in SERVICE_DEFS:
        existing = db.query(Service).filter(Service.id == sid).first()
        if not existing:
            svc = Service(
                id=sid,
                name=name,
                owner=owner,
                status="healthy",
                uptime_percentage=99.9,
                last_heartbeat=datetime.utcnow(),
            )
            db.add(svc)
    db.commit()


async def metrics_generator_loop(poll_interval_seconds: int = 3) -> None:
    """
    Background loop that:
    - Ensures services exist
    - Periodically generates new metric samples
    - Randomly creates logs & alerts
    """
    # bootstrap once at start
    db = SessionLocal()
    try:
        _bootstrap_services(db)
    finally:
        db.close()

    while True:
        db = SessionLocal()
        try:
            now = datetime.utcnow()
            services = db.query(Service).all()

            for svc in services:
                cpu = random.uniform(5, 95)
                mem = random.uniform(30, 95)
                req_rate = random.uniform(5, 200)
                err_rate = random.uniform(0, 10)

                metric = MetricSample(
                    service_id=svc.id,
                    timestamp=now,
                    cpu_usage=cpu,
                    memory_usage=mem,
                    request_rate=req_rate,
                    error_rate=err_rate,
                )
                db.add(metric)

                # Update service heartbeat + status
                svc.last_heartbeat = now

                if cpu > 90 or err_rate > 8:
                    svc.status = "down"
                    svc.uptime_percentage = max(svc.uptime_percentage - 0.1, 90.0)
                elif cpu > 75 or err_rate > 4:
                    svc.status = "degraded"
                    svc.uptime_percentage = max(svc.uptime_percentage - 0.05, 90.0)
                else:
                    svc.status = "healthy"
                    svc.uptime_percentage = min(svc.uptime_percentage + 0.02, 100.0)

                # logs
                # always at least one info log
                info_log = Log(
                    id=str(uuid4()),
                    service_id=svc.id,
                    timestamp=now,
                    level="INFO",
                    message=f"Service {svc.name} handled {req_rate:.1f} req/sec.",
                )
                db.add(info_log)

                # sometimes warn/error
                if err_rate > 0:
                    if err_rate > 4:
                        level = "ERROR"
                        msg = f"High error rate ({err_rate:.2f} errors/min)"
                    else:
                        level = "WARN"
                        msg = f"Non-zero error rate ({err_rate:.2f} errors/min)"

                    log = Log(
                        id=str(uuid4()),
                        service_id=svc.id,
                        timestamp=now,
                        level=level,
                        message=msg,
                    )
                    db.add(log)

                # alerts for high cpu / error rate
                if cpu > CPU_ALERT_THRESHOLD or err_rate > ERROR_RATE_ALERT_THRESHOLD:
                    severity = "high" if cpu > 90 or err_rate > 8 else "medium"
                    metric_type = "cpu" if cpu > CPU_ALERT_THRESHOLD else "errorRate"
                    alert = Alert(
                        id=str(uuid4()),
                        service_id=svc.id,
                        metric=metric_type,
                        severity=severity,
                        message=f"{metric_type} threshold breached",
                        triggered_at=now,
                        acknowledged=False,
                    )
                    db.add(alert)

            db.commit()
        finally:
            db.close()

        await asyncio.sleep(poll_interval_seconds)
