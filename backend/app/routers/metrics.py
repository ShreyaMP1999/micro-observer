from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import schemas, models
from ..deps import get_db

router = APIRouter()


@router.get("/{service_id}", response_model=List[schemas.MetricSnapshot])
def get_metrics_for_service(
    service_id: str,
    limit: int = Query(50, ge=1, le=500),
    db: Session = Depends(get_db),
):
    svc = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")

    metrics = (
        db.query(models.MetricSample)
        .filter(models.MetricSample.service_id == service_id)
        .order_by(models.MetricSample.timestamp.desc())
        .limit(limit)
        .all()
    )
    # returned newest → oldest; frontend can reverse if needed
    return metrics


@router.get("/{service_id}/latest", response_model=schemas.MetricSnapshot | None)
def get_latest_metrics_for_service(
    service_id: str, db: Session = Depends(get_db)
):
    metric = (
        db.query(models.MetricSample)
        .filter(models.MetricSample.service_id == service_id)
        .order_by(models.MetricSample.timestamp.desc())
        .first()
    )
    if not metric:
        return None
    return metric
