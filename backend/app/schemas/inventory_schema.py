from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InventoryBase(BaseModel):
    crop_name: str
    quantity_kg: float
    warehouse_location: str
    optimal_temperature: float
    optimal_humidity: float
    status: str # "Good", "Spoiling", "Critical"

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(BaseModel):
    quantity_kg: Optional[float] = None
    status: Optional[str] = None

class InventoryResponse(InventoryBase):
    id: int
    last_updated: datetime

    class Config:
        from_attributes = True
