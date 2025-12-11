from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(String, primary_key=True, index=True)  # e.g. "auth-service"
    name = Column(String, nullable=False)
    owner = Column(String, nullable=True)
    status = Column(String, nullable=False, default="healthy")  # healthy/degraded/down
    uptime_percentage = Column(Float, nullable=False, default=99.9)
    last_heartbeat = Column(DateTime, nullable=False, default=datetime.utcnow)

    metrics = relationship("MetricSample", back_populates="service", cascade="all, delete-orphan")
    logs = relationship("Log", back_populates="service", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="service", cascade="all, delete-orphan")


class MetricSample(Base):
    __tablename__ = "metric_samples"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    service_id = Column(String, ForeignKey("services.id"), index=True, nullable=False)
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    cpu_usage = Column(Float, nullable=False)
    memory_usage = Column(Float, nullable=False)
    request_rate = Column(Float, nullable=False)
    error_rate = Column(Float, nullable=False)

    service = relationship("Service", back_populates="metrics")


class Log(Base):
    __tablename__ = "logs"

    id = Column(String, primary_key=True)  # uuid
    service_id = Column(String, ForeignKey("services.id"), index=True, nullable=False)
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    level = Column(String, nullable=False)  # INFO/WARN/ERROR
    message = Column(String, nullable=False)
    trace_id = Column(String, nullable=True)

    service = relationship("Service", back_populates="logs")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True)  # uuid
    service_id = Column(String, ForeignKey("services.id"), index=True, nullable=False)
    metric = Column(String, nullable=False)  # cpu/memory/errorRate/uptime
    severity = Column(String, nullable=False)  # low/medium/high/critical
    message = Column(String, nullable=False)
    triggered_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    acknowledged = Column(Boolean, nullable=False, default=False)

    service = relationship("Service", back_populates="alerts")
