from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import schemas, models
from ..deps import get_db

router = APIRouter()


@router.get("/{service_id}", response_model=List[schemas.LogEntry])
def get_logs_for_service(
    service_id: str,
    level: schemas.LogLevel | None = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    svc = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")

    q = db.query(models.Log).filter(models.Log.service_id == service_id)
    if level:
        q = q.filter(models.Log.level == level.value)

    logs = q.order_by(models.Log.timestamp.desc()).limit(limit).all()
    return logs
