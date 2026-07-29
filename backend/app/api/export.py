import io
import csv
from datetime import datetime

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from fpdf import FPDF

from app.database.connection import get_db
from app.services.prediction_crud import get_all_predictions

router = APIRouter(prefix="/api", tags=["Export"])


@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db)):
    records = get_all_predictions(db, limit=10000)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "ID", "Region", "Soil Type", "Crop", "Rainfall (mm)", "Temperature (C)",
        "Fertilizer Used", "Irrigation Used", "Weather Condition", "Days to Harvest",
        "Predicted Yield", "Yield Category", "Model Used", "Created At"
    ])

    for r in records:
        writer.writerow([
            r.id, r.region, r.soil_type, r.crop, r.rainfall_mm, r.temperature_celsius,
            r.fertilizer_used, r.irrigation_used, r.weather_condition, r.days_to_harvest,
            r.predicted_yield, r.yield_category, r.model_used, r.created_at
        ])

    output.seek(0)
    filename = f"agriyield_predictions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/export/pdf")
def export_pdf(db: Session = Depends(get_db)):
    records = get_all_predictions(db, limit=500)  # cap for PDF readability

    pdf = FPDF(orientation="L", unit="mm", format="A4")
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, "AgriYield AI - Prediction History Report", ln=True, align="C")
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(0, 8, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True, align="C")
    pdf.ln(4)

    headers = ["ID", "Region", "Soil", "Crop", "Rainfall", "Temp", "Fert", "Irrig", "Weather", "Days", "Yield", "Category", "Model"]
    col_widths = [10, 20, 18, 18, 18, 16, 12, 14, 20, 14, 16, 20, 30]

    pdf.set_font("Helvetica", "B", 8)
    for h, w in zip(headers, col_widths):
        pdf.cell(w, 8, h, border=1)
    pdf.ln()

    pdf.set_font("Helvetica", "", 8)
    for r in records:
        row = [
            str(r.id), r.region, r.soil_type, r.crop, str(r.rainfall_mm), str(r.temperature_celsius),
            "Y" if r.fertilizer_used else "N", "Y" if r.irrigation_used else "N",
            r.weather_condition, str(r.days_to_harvest), str(r.predicted_yield),
            r.yield_category, r.model_used
        ]
        for val, w in zip(row, col_widths):
            pdf.cell(w, 7, str(val), border=1)
        pdf.ln()

    pdf_bytes = bytes(pdf.output())
    filename = f"agriyield_predictions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"

    return StreamingResponse(
        iter([pdf_bytes]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )