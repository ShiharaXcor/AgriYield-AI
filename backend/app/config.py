import os
from pathlib import Path
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

# ============================
# Base paths
# Works both locally (venv) and inside Docker containers.
# ============================
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # points to AgriYield-AI/backend locally

RUNNING_IN_DOCKER = os.getenv("RUNNING_IN_DOCKER", "false").lower() == "true"

if RUNNING_IN_DOCKER:
    MODEL_PATH = Path("/models/best_model.pkl")
    ENCODER_PATH = Path("/models/preprocessing/onehot_encoder.pkl")
    SCALER_PATH = Path("/models/preprocessing/scaler.pkl")
    FEATURE_COLUMNS_PATH = Path("/models/preprocessing/feature_columns.pkl")
    SHAP_BACKGROUND_PATH = Path("/models/preprocessing/shap_background_sample.pkl")
    DATA_PATH_OVERRIDE = Path("/data/cleaned_data.csv")
    REPORTS_DIR = Path("/reports")
else:
    PROJECT_ROOT = BASE_DIR.parent
    MODEL_PATH = PROJECT_ROOT / "models" / "best_model.pkl"
    ENCODER_PATH = PROJECT_ROOT / "models" / "preprocessing" / "onehot_encoder.pkl"
    SCALER_PATH = PROJECT_ROOT / "models" / "preprocessing" / "scaler.pkl"
    FEATURE_COLUMNS_PATH = PROJECT_ROOT / "models" / "preprocessing" / "feature_columns.pkl"
    SHAP_BACKGROUND_PATH = PROJECT_ROOT / "models" / "preprocessing" / "shap_background_sample.pkl"
    DATA_PATH_OVERRIDE = None
    REPORTS_DIR = PROJECT_ROOT / "reports"

# ============================
# Database configuration (MySQL)
# ============================
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = quote_plus(os.getenv("DB_PASSWORD", ""))  # URL-encodes special characters safely
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "agriyield_ai")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# ============================
# CORS
# ============================
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost",
]

# ============================
# Feature engineering constants
# (must exactly match what was used in notebooks/04_feature_engineering.ipynb)
# ============================
CATEGORICAL_COLS = ["Region", "Soil_Type", "Crop", "Weather_Condition"]

NUMERIC_COLS_TO_SCALE = [
    "Rainfall_mm",
    "Temperature_Celsius",
    "Days_to_Harvest",
    "Rainfall_per_Day",
    "Temperature_Deviation",
]

OPTIMAL_TEMP = {
    "Wheat": 22,
    "Rice": 27,
    "Maize": 25,
    "Barley": 20,
    "Cotton": 28,
    "Soybean": 26,
}

# ============================
# App metadata
# ============================
APP_NAME = "AgriYield AI"
APP_VERSION = "1.0.0"