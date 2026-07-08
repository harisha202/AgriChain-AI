from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.inventory import Inventory
from app.schemas.inventory_schema import InventoryCreate, InventoryUpdate, InventoryResponse
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/inventory", tags=["inventory"])

@router.get("/", response_model=List[InventoryResponse])
def get_inventory(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Inventory).all()

@router.post("/", response_model=InventoryResponse)
def add_inventory(item: InventoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_item = Inventory(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/{item_id}", response_model=InventoryResponse)
def update_inventory(item_id: int, item: InventoryUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    update_data = item.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/alerts")
def get_inventory_alerts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Low stock alert threshold (e.g., under 100 kg)
    low_stock = db.query(Inventory).filter(Inventory.quantity_kg < 100).all()
    # Spoilage risk (status is not 'Good')
    spoiling = db.query(Inventory).filter(Inventory.status != "Good").all()
    
    return {
        "low_stock_items": [{"id": i.id, "crop_name": i.crop_name, "quantity_kg": i.quantity_kg} for i in low_stock],
        "spoilage_risks": [{"id": i.id, "crop_name": i.crop_name, "status": i.status} for i in spoiling]
    }
