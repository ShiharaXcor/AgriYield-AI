from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime
from datetime import datetime

from app.database.connection import Base


class PredictionRecord(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    region = Column(String(50), nullable=False)
    soil_type = Column(String(50), nullable=False)
    crop = Column(String(50), nullable=False)
    rainfall_mm = Column(Float, nullable=False)
    temperature_celsius = Column(Float, nullable=False)
    fertilizer_used = Column(Boolean, nullable=False)
    irrigation_used = Column(Boolean, nullable=False)
    weather_condition = Column(String(50), nullable=False)
    days_to_harvest = Column(Integer, nullable=False)

    predicted_yield = Column(Float, nullable=False)
    yield_category = Column(String(20), nullable=True)
    model_used = Column(String(50), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)