import pandas as pd
from fastapi import APIRouter, HTTPException
from functools import lru_cache

from app.config import BASE_DIR

router = APIRouter(prefix="/api", tags=["Analytics"])

DATA_PATH = BASE_DIR / "data" / "cleaned_data.csv"


@lru_cache(maxsize=1)
def load_data():
    """Cached load — the CSV is read from disk only once, on first request."""
    return pd.read_csv(DATA_PATH)


@router.get("/analytics")
def get_analytics(crop: str = None, region: str = None, season: str = None):
    if not DATA_PATH.exists():
        raise HTTPException(status_code=404, detail="Dataset not found")

    df = load_data().copy()

    if crop:
        df = df[df["Crop"] == crop]
    if region:
        df = df[df["Region"] == region]
    if season and "Season" in df.columns:
        df = df[df["Season"] == season]

    if df.empty:
        return {"error": "No data matches the selected filters"}

    yield_by_crop = df.groupby("Crop")["Yield_tons_per_hectare"].mean().round(3).to_dict()
    yield_by_region = df.groupby("Region")["Yield_tons_per_hectare"].mean().round(3).to_dict()
    yield_by_soil = df.groupby("Soil_Type")["Yield_tons_per_hectare"].mean().round(3).to_dict()
    yield_by_weather = df.groupby("Weather_Condition")["Yield_tons_per_hectare"].mean().round(3).to_dict()

    yield_by_fertilizer = df.groupby("Fertilizer_Used")["Yield_tons_per_hectare"].mean().round(3).to_dict()
    yield_by_irrigation = df.groupby("Irrigation_Used")["Yield_tons_per_hectare"].mean().round(3).to_dict()

    # Rainfall vs Yield scatter — sample for performance
    scatter_sample = df.sample(min(500, len(df)), random_state=42)[
        ["Rainfall_mm", "Temperature_Celsius", "Yield_tons_per_hectare"]
    ].round(2).to_dict(orient="records")

    return {
        "filters_applied": {"crop": crop, "region": region, "season": season},
        "total_records": len(df),
        "yield_by_crop": yield_by_crop,
        "yield_by_region": yield_by_region,
        "yield_by_soil": yield_by_soil,
        "yield_by_weather": yield_by_weather,
        "yield_by_fertilizer": {str(k): v for k, v in yield_by_fertilizer.items()},
        "yield_by_irrigation": {str(k): v for k, v in yield_by_irrigation.items()},
        "rainfall_temp_yield_scatter": scatter_sample,
    }


@router.get("/analytics/filter-options")
def get_filter_options():
    df = load_data()
    return {
        "crops": sorted(df["Crop"].unique().tolist()),
        "regions": sorted(df["Region"].unique().tolist()),
        "soil_types": sorted(df["Soil_Type"].unique().tolist()),
        "weather_conditions": sorted(df["Weather_Condition"].unique().tolist()),
    }