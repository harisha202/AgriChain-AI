from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import os
import anthropic
from app.dependencies import get_current_user
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.inventory import Inventory
from app.models.shipment import Shipment
from app.models.sales_history import SalesHistory
from app.models.crop_query import CropQuery
from app.models.user import User

router = APIRouter(prefix="/api/assistant", tags=["assistant"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@router.post("/ask")
def ask_assistant(request: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return {"reply": "API key not found. Please add ANTHROPIC_API_KEY to your .env file."}
        
    try:
        # Fetch live data context
        inventory = db.query(Inventory).all()
        shipments = db.query(Shipment).all()
        sales = db.query(SalesHistory).all()
        crop_queries = db.query(CropQuery).order_by(CropQuery.id.desc()).limit(3).all()
        
        inv_str = ", ".join([f"{i.quantity_kg}kg of {i.crop_name} in {i.warehouse_location} (Status: {i.status})" for i in inventory])
        shp_str = ", ".join([f"Shipment {s.shipment_id}: {s.crop_name} to {s.destination} (Status: {s.status})" for s in shipments])
        sales_str = ", ".join([f"Sold {s.quantity_sold}kg of {s.crop_name} in {s.region} for ${s.price_per_kg}/kg" for s in sales])
        crop_str = ", ".join([f"Predicted {c.predicted_crop} for NPK({c.N},{c.P},{c.K})" for c in crop_queries])
        
        system_prompt = f"""You are AgriChain AI, an expert supply chain and smart farming assistant. 
You help users optimize their inventory, track logistics, understand crop ML predictions, and analyze sales performance.
Current System Data Context:
- Inventory: {inv_str or 'No inventory data.'}
- Active Logistics: {shp_str or 'No active shipments.'}
- Recent Sales (Analytics): {sales_str or 'No sales recorded yet.'}
- Recent Crop AI Predictions: {crop_str or 'No crops predicted yet.'}
Use this live data to answer the user's questions accurately. Be concise and professional."""

        # Format messages for Anthropic (must start with user)
        anthropic_messages = []
        for msg in request.messages:
            if msg.role == 'assistant' and 'Hello! I am your AgriChain AI' in msg.content:
                continue
            role = msg.role if msg.role in ['user', 'assistant'] else 'user'
            anthropic_messages.append({"role": role, "content": msg.content})
            
        # Ensure it starts with user
        if not anthropic_messages or anthropic_messages[0]['role'] != 'user':
            anthropic_messages.insert(0, {"role": "user", "content": "Hello."})

        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1024,
            system=system_prompt,
            messages=anthropic_messages
        )
        
        return {"reply": response.content[0].text}
    except Exception as e:
        return {"reply": f"An error occurred while calling the AI: {str(e)}"}
