from sqlalchemy import Column, Integer, String, Float, Date
from app.database import Base

class SalesHistory(Base):
    __tablename__ = "sales_history"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String, index=True)
    quantity_sold = Column(Float)
    sale_date = Column(Date, index=True)
    region = Column(String)
    price_per_kg = Column(Float)
