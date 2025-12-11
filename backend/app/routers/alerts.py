from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from .. import schemas, models
from ..deps import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.Alert])
def list_alerts(
    only_open: bool = Query(False, description="Return only unresolved alerts"),
    db: Session = Depends(get_db),
):
    q = db.query(models.Alert)
    if only_open:
        q = q.filter(models.Alert.resolved_at.is_(None))
    alerts = q.order_by(models.Alert.triggered_at.desc()).all()
    return alerts


@router.get("/recent", response_model=List[schemas.Alert])
def recent_alerts(
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    alerts = (
        db.query(models.Alert)
        .order_by(models.Alert.triggered_at.desc())
        .limit(limit)
        .all()
    )
    return alerts


@router.post("/{alert_id}/acknowledge", response_model=schemas.Alert)
def acknowledge_alert(alert_id: str, db: Session = Depends(get_db)):
    """
    Mark a single alert as acknowledged (and set resolved_at if it wasn't set).
    """
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.acknowledged = True
    if alert.resolved_at is None:
        alert.resolved_at = datetime.utcnow()

    db.commit()
    db.refresh(alert)
    return alert
