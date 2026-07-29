from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PredictionInput(BaseModel):
    Region: str = Field(..., examples=["North"])
    Soil_Type: str = Field(..., examples=["Loam"])
    Crop: str = Field(..., examples=["Wheat"])
    Rainfall_mm: float = Field(..., ge=0, le=2000, examples=[450.5])
    Temperature_Celsius: float = Field(..., ge=-10, le=60, examples=[24.5])
    Fertilizer_Used: bool = Field(..., examples=[True])
    Irrigation_Used: bool = Field(..., examples=[True])
    Weather_Condition: str = Field(..., examples=["Sunny"])
    Days_to_Harvest: int = Field(..., ge=1, le=365, examples=[110])


class PredictionOutput(BaseModel):
    predicted_yield: float
    yield_category: str
    confidence: str
    model_used: str
    prediction_time_ms: float
    recommendations: list[str]


class PredictionHistoryItem(BaseModel):
    id: int
    region: str
    soil_type: str
    crop: str
    rainfall_mm: float
    temperature_celsius: float
    fertilizer_used: bool
    irrigation_used: bool
    weather_condition: str
    days_to_harvest: int
    predicted_yield: float
    model_used: str
    created_at: datetime

    class Config:
        from_attributes = True