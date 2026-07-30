from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import APP_NAME, APP_VERSION, CORS_ORIGINS
from app.database.connection import Base, engine
from app.models.prediction import PredictionRecord

from app.api import predict, model_info, dashboard, history, export, analytics

# ============================
# Create database tables on startup
# ============================
Base.metadata.create_all(bind=engine)

# ============================
# Initialize FastAPI app
# ============================
app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description=(
        "AgriYield AI — Intelligent Crop Yield Prediction and Agricultural "
        "Decision Support System using Machine Learning."
    ),
)

# ============================
# CORS middleware
# ============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# Register routers
# ============================
app.include_router(predict.router)
app.include_router(model_info.router)
app.include_router(dashboard.router)
app.include_router(history.router)
app.include_router(export.router)
app.include_router(analytics.router)


# ============================
# Root & health check
# ============================
@app.get("/")
def root():
    return {
        "message": f"{APP_NAME} API is running",
        "version": APP_VERSION,
        "docs": "/docs",
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}