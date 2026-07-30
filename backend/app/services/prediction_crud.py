from sqlalchemy.orm import Session
from app.models.prediction import PredictionRecord


def save_prediction(db: Session, raw_input: dict, result: dict) -> PredictionRecord:
    record = PredictionRecord(
        region=raw_input["Region"],
        soil_type=raw_input["Soil_Type"],
        crop=raw_input["Crop"],
        rainfall_mm=raw_input["Rainfall_mm"],
        temperature_celsius=raw_input["Temperature_Celsius"],
        fertilizer_used=raw_input["Fertilizer_Used"],
        irrigation_used=raw_input["Irrigation_Used"],
        weather_condition=raw_input["Weather_Condition"],
        days_to_harvest=raw_input["Days_to_Harvest"],
        predicted_yield=result["predicted_yield"],
        yield_category=result["yield_category"],
        model_used=result["model_used"],
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_all_predictions(db: Session, limit: int = 100, skip: int = 0):
    return (
        db.query(PredictionRecord)
        .order_by(PredictionRecord.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_prediction_count(db: Session) -> int:
    return db.query(PredictionRecord).count()


def delete_prediction(db: Session, prediction_id: int) -> bool:
    record = db.query(PredictionRecord).filter(PredictionRecord.id == prediction_id).first()
    if record:
        db.delete(record)
        db.commit()
        return True
    return False


def get_dashboard_stats(db: Session) -> dict:
    from sqlalchemy import func

    total = db.query(PredictionRecord).count()
    if total == 0:
        return {
            "total_predictions": 0,
            "average_yield": 0,
            "average_rainfall": 0,
            "average_temperature": 0,
        }

    avg_yield = db.query(func.avg(PredictionRecord.predicted_yield)).scalar()
    avg_rainfall = db.query(func.avg(PredictionRecord.rainfall_mm)).scalar()
    avg_temp = db.query(func.avg(PredictionRecord.temperature_celsius)).scalar()

    return {
        "total_predictions": total,
        "average_yield": round(avg_yield, 3) if avg_yield else 0,
        "average_rainfall": round(avg_rainfall, 2) if avg_rainfall else 0,
        "average_temperature": round(avg_temp, 2) if avg_temp else 0,
    }