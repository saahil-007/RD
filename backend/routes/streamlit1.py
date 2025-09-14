import streamlit as st
import pandas as pd
import joblib

# ---------------------------
# Load model, scaler, and target encoder
# ---------------------------
model = joblib.load("xgb_model.pkl")
scaler = joblib.load("scaler.pkl")
target_encoder = joblib.load("target_encoder.pkl")  # LabelEncoder for diseases

# ---------------------------
# Streamlit UI
# ---------------------------
st.title("🩺 Disease Prediction App")
st.write("Enter patient and water quality details to predict the disease")

# Feature list (must match training data order)
feature_list = [
    "Age","ECG Category","Heart Rate","Systolic BP","Diastolic BP","Glucose",
    "SpO2","Body Temperature","Gender","temperature_C","turbidity_NTU","pH",
    "DO_mg_L","BOD_mg_L","COD_mg_L","nitrate_mg_L","phosphate_mg_L","TDS_mg_L",
    "conductivity_uS_cm","fecal_coliform_CFU_100mL","WQI"
]

user_input = {}
for feature in feature_list:
    user_input[feature] = st.number_input(f"{feature}", value=0.0)

if st.button("🔍 Predict Disease"):
    input_df = pd.DataFrame([user_input])

    # Scale input
    input_scaled = scaler.transform(input_df)

    # Predict numeric label
    prediction_num = int(model.predict(input_scaled)[0])

    # Decode number -> disease name
    disease_name = target_encoder.inverse_transform([prediction_num])[0]

    st.success(f"🩺 Predicted Disease: {disease_name}")
