from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ShipmentBase(BaseModel):
    shipment_id: str
    origin: str
    destination: str
    crop_name: str
    quantity_kg: float
    status: str # "In Transit", "Delivered", "Delayed"
    estimated_arrival: datetime

class ShipmentCreate(ShipmentBase):
    pass

class ShipmentUpdate(BaseModel):
    status: Optional[str] = None
    estimated_arrival: Optional[datetime] = None

class ShipmentResponse(ShipmentBase):
    id: int

    class Config:
        orm_mode = True
