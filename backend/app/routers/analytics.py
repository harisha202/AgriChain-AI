from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
import pandas as pd
import json

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/dashboard")
def get_dashboard_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Read sales history into pandas DataFrame, optimized to last 12 months to prevent lag
    query = """
    SELECT * FROM sales_history 
    WHERE sale_date >= date('now', '-12 months')
    """
    df = pd.read_sql(query, db.bind)
    
    if df.empty:
        return {"message": "No sales data available for analytics."}
        
    df['sale_date'] = pd.to_datetime(df['sale_date'])
    df['revenue'] = df['quantity_sold'] * df['price_per_kg']
    
    # 1. Total Metrics
    total_revenue = df['revenue'].sum()
    total_volume = df['quantity_sold'].sum()
    
    # 2. Revenue by Crop
    revenue_by_crop = df.groupby('crop_name')['revenue'].sum().reset_index()
    
    # 3. Sales Trend over time (monthly)
    df_monthly = df.set_index('sale_date').resample('M')['revenue'].sum().reset_index()
    df_monthly['sale_date'] = df_monthly['sale_date'].dt.strftime('%Y-%m')
    
    # 4. Regional Distribution
    regional = df.groupby('region')['quantity_sold'].sum().reset_index()

    return {
        "kpis": {
            "total_revenue": round(float(total_revenue), 2),
            "total_volume_kg": round(float(total_volume), 2)
        },
        "revenue_by_crop": revenue_by_crop.to_dict(orient="records"),
        "sales_trend": df_monthly.to_dict(orient="records"),
        "regional_distribution": regional.to_dict(orient="records")
    }
