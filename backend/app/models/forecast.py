from sqlalchemy import Column, Integer, String, Float, Date
from app.database import Base

class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String, index=True)
    forecast_period = Column(Date)
    predicted_demand = Column(Float)
    actual_demand = Column(Float, nullable=True)
    model_version = Column(String)
