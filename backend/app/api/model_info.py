import json
from pathlib import Path
from fastapi import APIRouter, HTTPException

from app.config import BASE_DIR

router = APIRouter(prefix="/api", tags=["Model Info"])

REPORTS_DIR = BASE_DIR / "reports"


@router.get("/model-performance")
def get_model_performance():
    csv_path = REPORTS_DIR / "model_comparison.csv"
    if not csv_path.exists():
        raise HTTPException(status_code=404, detail="Model comparison data not found")

    import pandas as pd
    df = pd.read_csv(csv_path, index_col=0)
    return df.reset_index().rename(columns={"index": "model_name"}).to_dict(orient="records")


@router.get("/feature-importance")
def get_feature_importance():
    json_path = REPORTS_DIR / "explainability_summary.json"
    if not json_path.exists():
        raise HTTPException(status_code=404, detail="Feature importance data not found")

    with open(json_path, "r") as f:
        data = json.load(f)
    return data