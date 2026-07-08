from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app.database import get_db
from app.models.shipment import Shipment
from app.models.inventory import Inventory
from app.models.sales_history import SalesHistory
from app.schemas.logistics_schema import ShipmentCreate, ShipmentUpdate, ShipmentResponse
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/logistics", tags=["logistics"])

@router.get("/", response_model=List[ShipmentResponse])
def get_shipments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Shipment).all()

@router.post("/", response_model=ShipmentResponse)
def create_shipment(shipment: ShipmentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Link Logistics to Inventory: Deduct stock
    inventory_item = db.query(Inventory).filter(
        Inventory.crop_name == shipment.crop_name,
        Inventory.warehouse_location == shipment.origin
    ).first()
    
    if not inventory_item:
        # Fallback to any inventory of that crop if origin doesn't match exactly
        inventory_item = db.query(Inventory).filter(Inventory.crop_name == shipment.crop_name).first()
        
    if not inventory_item or inventory_item.quantity_kg < shipment.quantity_kg:
        raise HTTPException(status_code=400, detail=f"Not enough stock in inventory for {shipment.crop_name}")
        
    inventory_item.quantity_kg -= shipment.quantity_kg

    db_shipment = Shipment(**shipment.dict())
    db.add(db_shipment)
    db.commit()
    db.refresh(db_shipment)
    return db_shipment

@router.put("/{shipment_id}", response_model=ShipmentResponse)
def update_shipment_status(shipment_id: int, shipment: ShipmentUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not db_shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
        
    update_data = shipment.dict(exclude_unset=True)
    
    # Check if status is transitioning to Delivered
    if update_data.get("status") == "Delivered" and db_shipment.status != "Delivered":
        # Link Logistics to Analytics: Record sale
        sale = SalesHistory(
            crop_name=db_shipment.crop_name,
            quantity_sold=db_shipment.quantity_kg,
            sale_date=date.today(),
            region=db_shipment.destination,
            price_per_kg=15.0  # Default mock price
        )
        db.add(sale)
        
    for key, value in update_data.items():
        setattr(db_shipment, key, value)
        
    db.commit()
    db.refresh(db_shipment)
    return db_shipment
