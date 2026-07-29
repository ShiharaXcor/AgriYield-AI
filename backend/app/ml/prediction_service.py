import joblib
import pandas as pd
import numpy as np
import shap
import time
from datetime import datetime

from app.config import (
    MODEL_PATH, ENCODER_PATH, SCALER_PATH, FEATURE_COLUMNS_PATH,
    SHAP_BACKGROUND_PATH, CATEGORICAL_COLS, NUMERIC_COLS_TO_SCALE, OPTIMAL_TEMP
)


class PredictionService:
    """
    Loads the trained model and preprocessing artifacts once at startup,
    and provides methods to transform raw input into model-ready features,
    generate predictions, and explain them via SHAP.
    """

    def __init__(self):
        self.model = joblib.load(MODEL_PATH)
        self.encoder = joblib.load(ENCODER_PATH)
        self.scaler = joblib.load(SCALER_PATH)
        self.feature_columns = joblib.load(FEATURE_COLUMNS_PATH)
        self.model_name = type(self.model).__name__

        # Set up SHAP explainer based on model type
        self.shap_background = joblib.load(SHAP_BACKGROUND_PATH)
        if self.model_name == "LinearRegression":
            self.explainer = shap.LinearExplainer(self.model, self.shap_background)
        elif self.model_name in ["XGBRegressor", "LGBMRegressor", "DecisionTreeRegressor"]:
            self.explainer = shap.TreeExplainer(self.model)
        else:
            self.explainer = shap.Explainer(self.model, self.shap_background)

    def _engineer_features(self, raw_input: dict) -> pd.DataFrame:
        """
        Replicates the exact feature engineering steps from
        notebooks/04_feature_engineering.ipynb on a single raw input dict.
        """
        df = pd.DataFrame([raw_input])

        # Feature: Rainfall per day
        df["Rainfall_per_Day"] = df["Rainfall_mm"] / df["Days_to_Harvest"]

        # Feature: Fertilizer x Irrigation interaction
        def combo_label(row):
            if row["Fertilizer_Used"] and row["Irrigation_Used"]:
                return "Both"
            elif row["Fertilizer_Used"]:
                return "Fertilizer_Only"
            elif row["Irrigation_Used"]:
                return "Irrigation_Only"
            else:
                return "Neither"

        df["Fertilizer_Irrigation_Combo"] = df.apply(combo_label, axis=1)

        # Feature: Temperature deviation from crop-specific optimum
        df["Optimal_Temp"] = df["Crop"].map(OPTIMAL_TEMP)
        df["Temperature_Deviation"] = (df["Temperature_Celsius"] - df["Optimal_Temp"]).abs()
        df = df.drop(columns=["Optimal_Temp"])

        # Feature: Growing season length category
        def season_length_category(days):
            if days < 90:
                return "Short"
            elif days <= 120:
                return "Medium"
            else:
                return "Long"

        df["Season_Length_Category"] = df["Days_to_Harvest"].apply(season_length_category)

        return df

    def _encode_and_scale(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Applies the saved OneHotEncoder and StandardScaler, then reindexes
        to match the exact column order the model was trained on.
        """
        encode_cols = ["Region", "Soil_Type", "Crop", "Weather_Condition",
                        "Fertilizer_Irrigation_Combo", "Season_Length_Category"]

        encoded_array = self.encoder.transform(df[encode_cols])
        encoded_cols = self.encoder.get_feature_names_out(encode_cols)
        encoded_df = pd.DataFrame(encoded_array, columns=encoded_cols, index=df.index)

        df_final = pd.concat([df.drop(columns=encode_cols), encoded_df], axis=1)

        df_final["Fertilizer_Used"] = df_final["Fertilizer_Used"].astype(int)
        df_final["Irrigation_Used"] = df_final["Irrigation_Used"].astype(int)

        df_final[NUMERIC_COLS_TO_SCALE] = self.scaler.transform(df_final[NUMERIC_COLS_TO_SCALE])

        # Ensure exact column order/presence matches training data
        df_final = df_final.reindex(columns=self.feature_columns, fill_value=0)

        return df_final

    def _categorize_yield(self, yield_value: float) -> str:
        if yield_value < 3:
            return "Low"
        elif yield_value < 6:
            return "Medium"
        elif yield_value < 8:
            return "High"
        else:
            return "Very High"

    def _generate_recommendations(self, raw_input: dict, predicted_yield: float) -> list[str]:
        """
        Converts prediction + input conditions into practical agricultural
        recommendations for the Decision Support page.
        """
        recs = []

        if raw_input["Rainfall_mm"] < 300:
            recs.append("Low rainfall detected — consider improving irrigation infrastructure.")
        if not raw_input["Fertilizer_Used"]:
            recs.append("No fertilizer used — soil testing is recommended to assess nutrient needs.")
        if not raw_input["Irrigation_Used"]:
            recs.append("No irrigation used — irrigation could significantly improve yield outcomes.")
        if predicted_yield < 3:
            recs.append("Low predicted yield — inspect for pest or disease pressure, and review soil health.")
        if predicted_yield >= 8:
            recs.append("High predicted yield — prepare adequate storage capacity ahead of harvest.")
            recs.append("High predicted yield — arrange transportation logistics in advance.")
            recs.append("High predicted yield — consider hiring additional labor for harvest.")
        if raw_input["Temperature_Celsius"] > 35:
            recs.append("High temperature conditions — monitor crops for heat stress.")

        if not recs:
            recs.append("Conditions appear balanced — maintain current management practices.")

        return recs

    def predict(self, raw_input: dict) -> dict:
        start_time = time.time()

        engineered_df = self._engineer_features(raw_input)
        processed_df = self._encode_and_scale(engineered_df)

        predicted_yield = float(self.model.predict(processed_df)[0])
        predicted_yield = max(0, predicted_yield)  # yield can't be negative

        elapsed_ms = (time.time() - start_time) * 1000

        return {
            "predicted_yield": round(predicted_yield, 3),
            "yield_category": self._categorize_yield(predicted_yield),
            "confidence": "High" if self.model_name in ["LinearRegression", "XGBRegressor", "LGBMRegressor"] else "Medium",
            "model_used": self.model_name,
            "prediction_time_ms": round(elapsed_ms, 2),
            "recommendations": self._generate_recommendations(raw_input, predicted_yield),
            "processed_features": processed_df,  # kept internally for SHAP explanation, not returned to client directly
        }

    def explain_prediction(self, processed_df: pd.DataFrame) -> dict:
        """
        Returns SHAP values for a single processed prediction row,
        formatted for easy consumption by the frontend.
        """
        shap_values = self.explainer(processed_df)

        feature_impacts = sorted(
            zip(processed_df.columns, shap_values.values[0]),
            key=lambda x: abs(x[1]),
            reverse=True
        )[:10]

        return {
            "base_value": float(shap_values.base_values[0]),
            "top_feature_impacts": [
                {"feature": f, "impact": round(float(v), 4)} for f, v in feature_impacts
            ]
        }


# Singleton instance loaded once when the app starts
prediction_service = PredictionService()