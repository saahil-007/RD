# api.py
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# Load artifacts
try:
    model = joblib.load("routes/xgb_model.pkl")
    scaler = joblib.load("routes/scaler.pkl")
    disease_mapping = joblib.load("routes/disease_mapping.pkl")
except Exception as e:
    model = scaler = disease_mapping = None
    print(f"⚠️ Error loading artifacts: {e}")

class PatientData(BaseModel):
    Age: float
    ECG_Category: float
    Heart_Rate: float
    Systolic_BP: float
    Diastolic_BP: float
    Glucose: float
    SpO2: float
    Body_Temperature: float
    Gender: float
    temperature_C: float
    turbidity_NTU: float
    pH: float
    DO_mg_L: float
    BOD_mg_L: float
    COD_mg_L: float
    nitrate_mg_L: float
    phosphate_mg_L: float
    TDS_mg_L: float
    conductivity_uS_cm: float
    fecal_coliform_CFU_100mL: float
    WQI: float

@app.get("/")
def root():
    return {"status": "API running"}

@app.post("/predict")
def predict(data: PatientData):
    if not all([model, scaler, disease_mapping]):
        raise HTTPException(status_code=500, detail="Model artifacts not loaded.")

    try:
        input_df = pd.DataFrame([data.dict()])

        # Scale
        input_scaled = scaler.transform(input_df)

        # Predict
        pred = model.predict(input_scaled)
        pred_label = int(pred[0])

        # Map to disease name
        disease_name = disease_mapping.get(pred_label, f"Unknown({pred_label})")

        return {"disease": disease_name}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error during prediction: {str(e)}")
