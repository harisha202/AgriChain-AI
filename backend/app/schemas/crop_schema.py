from pydantic import BaseModel

class CropPredictionRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class CropPredictionResponse(BaseModel):
    predicted_crop: str
    confidence: float
