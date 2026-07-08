from sqlalchemy import Column, Integer, String, Float, Date, DateTime
from app.database import Base
from datetime import datetime

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String, index=True)
    quantity_kg = Column(Float)
    warehouse_location = Column(String)
    harvest_date = Column(Date)
    spoilage_rate = Column(Float)
    reorder_point = Column(Float)
    optimal_temperature = Column(Float, nullable=True)
    optimal_humidity = Column(Float, nullable=True)
    status = Column(String, default="Good")
    last_updated = Column(DateTime, default=datetime.utcnow)
