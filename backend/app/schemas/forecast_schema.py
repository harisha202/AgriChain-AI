from pydantic import BaseModel
from typing import List

class ForecastRequest(BaseModel):
    crop_name: str
    days_ahead: int = 30

class DailyForecast(BaseModel):
    date: str
    predicted_demand: float

class ForecastResponse(BaseModel):
    crop_name: str
    forecasts: List[DailyForecast]
