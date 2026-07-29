from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services.prediction_crud import get_dashboard_stats, get_all_predictions
from app.ml.prediction_service import prediction_service

router = APIRouter(prefix="/api", tags=["Dashboard"])


@router.get("/dashboard")
def get_dashboard_data(db: Session = Depends(get_db)):
    stats = get_dashboard_stats(db)
    recent = get_all_predictions(db, limit=5)

    return {
        **stats,
        "best_performing_model": prediction_service.model_name,
        "recent_predictions": [
            {
                "id": p.id,
                "crop": p.crop,
                "region": p.region,
                "predicted_yield": p.predicted_yield,
                "yield_category": p.yield_category,
                "created_at": p.created_at,
            }
            for p in recent
        ],
    }