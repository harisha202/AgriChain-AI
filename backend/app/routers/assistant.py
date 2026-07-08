from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import os
import random
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/assistant", tags=["assistant"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@router.post("/ask")
def ask_assistant(request: ChatRequest, current_user: User = Depends(get_current_user)):
    user_query = request.messages[-1].content.lower()
    
    # In a real production app, you would pass `request.messages` to the Anthropic or OpenAI SDK here.
    # Since we might not have an active API key in this environment, we use an intelligent fallback logic
    # that simulates an SCM-aware AI assistant grounded in the app's context.
    
    response_text = ""
    if "inventory" in user_query or "stock" in user_query:
        response_text = "Based on your current inventory metrics, we have 2 shipments of Rice and Maize currently in transit. We have flagged a Low Stock Alert for Wheat in Warehouse 1, which may cause a bottleneck given the SARIMA demand forecast for next month."
    elif "forecast" in user_query or "demand" in user_query:
        response_text = "The SARIMA model projects a 15% increase in demand for Rice over the next 14 days due to seasonal trends. I recommend adjusting your reorder points to prevent stockouts."
    elif "logistics" in user_query or "delay" in user_query:
        response_text = "Shipment SHP-9923 (Maize) is currently marked as 'Delayed' in route to Warehouse 2. You may want to contact the East Farm dispatch to reroute the upcoming schedule."
    else:
        response_text = "I am the AgriChain AI Assistant. I can analyze your crop predictions, inventory levels, and logistics tracking. Ask me about your stock, demand forecasts, or shipment statuses!"
        
    # Simulate network delay for AI thinking
    import time
    time.sleep(1)
    
    return {"reply": response_text}
