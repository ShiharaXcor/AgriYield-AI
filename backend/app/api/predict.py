from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.prediction import PredictionInput, PredictionOutput
from app.ml.prediction_service import prediction_service
from app.services.prediction_crud import save_prediction

router = APIRouter(prefix="/api", tags=["Prediction"])


@router.post("/predict", response_model=PredictionOutput)
def predict_yield(input_data: PredictionInput, db: Session = Depends(get_db)):
    try:
        raw_input = input_data.model_dump()
        result = prediction_service.predict(raw_input)

        # Save to database (drop the internal-only processed_features before persisting)
        save_prediction(db, raw_input, result)

        # Remove internal field before returning to client
        response = {k: v for k, v in result.items() if k != "processed_features"}
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.post("/predict/explain")
def predict_with_explanation(input_data: PredictionInput):
    try:
        raw_input = input_data.model_dump()
        result = prediction_service.predict(raw_input)
        explanation = prediction_service.explain_prediction(result["processed_features"])

        return {
            "predicted_yield": result["predicted_yield"],
            "yield_category": result["yield_category"],
            "explanation": explanation,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation failed: {str(e)}")