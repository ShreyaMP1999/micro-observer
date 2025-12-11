from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import schemas, models
from ..deps import get_db

router = APIRouter()


@router.get("/", response_model=list[schemas.Service])
def list_services(db: Session = Depends(get_db)):
    services = db.query(models.Service).all()
    return services


@router.get("/summary", response_model=schemas.ServiceHealthSummary)
def get_summary(db: Session = Depends(get_db)):
    total = db.query(models.Service).count()
    healthy = db.query(models.Service).filter(models.Service.status == "healthy").count()
    degraded = db.query(models.Service).filter(models.Service.status == "degraded").count()
    down = db.query(models.Service).filter(models.Service.status == "down").count()
    open_alerts = db.query(models.Alert).filter(models.Alert.resolved_at.is_(None)).count()

    return schemas.ServiceHealthSummary(
        total_services=total,
        healthy_count=healthy,
        degraded_count=degraded,
        down_count=down,
        open_alerts_count=open_alerts,
    )


@router.get("/{service_id}", response_model=schemas.Service)
def get_service(service_id: str, db: Session = Depends(get_db)):
    svc = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    return svc
