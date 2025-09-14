from pydantic import BaseModel

class HealthData(BaseModel):
    name: str
    age: int
    ecg_category: str
    heart_rate: float
    systolic_bp: float
    diastolic_bp: float
    glucose: float
    spo2: float
    body_temperature: float
    gender: str