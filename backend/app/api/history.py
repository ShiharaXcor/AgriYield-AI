from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.prediction import PredictionHistoryItem
from app.services.prediction_crud import get_all_predictions, delete_prediction, get_prediction_count

router = APIRouter(prefix="/api", tags=["History"])


@router.get("/history", response_model=list[PredictionHistoryItem])
def get_history(
    limit: int = Query(50, le=500),
    skip: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    records = get_all_predictions(db, limit=limit, skip=skip)
    return records


@router.get("/history/count")
def get_history_count(db: Session = Depends(get_db)):
    return {"total": get_prediction_count(db)}


@router.delete("/history/{prediction_id}")
def delete_history_item(prediction_id: int, db: Session = Depends(get_db)):
    success = delete_prediction(db, prediction_id)
    if not success:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return {"message": "Prediction deleted successfully"}