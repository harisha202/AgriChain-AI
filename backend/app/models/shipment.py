from sqlalchemy import Column, Integer, String, Date, DateTime, Float
from app.database import Base

class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(String, unique=True, index=True)
    crop_name = Column(String, index=True)
    quantity_kg = Column(Float)
    origin = Column(String)
    destination = Column(String)
    dispatch_date = Column(Date)
    delivery_date = Column(Date, nullable=True)
    estimated_arrival = Column(DateTime, nullable=True)
    status = Column(String) # in transit, delayed, delivered
    delay_reason = Column(String, nullable=True)
