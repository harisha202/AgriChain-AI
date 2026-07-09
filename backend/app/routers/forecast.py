from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
from datetime import datetime
from app.database import get_db
from app.schemas.forecast_schema import ForecastRequest, ForecastResponse
from app.models.forecast import Forecast
from app.models.sales_history import SalesHistory
from app.ml.forecast_demand import predict_future_demand
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/forecast", tags=["forecast"])

@router.post("/demand", response_model=ForecastResponse)
def get_demand_forecast(request: ForecastRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        results = predict_future_demand(request.crop_name, request.days_ahead)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Forecasting failed")
        
    # Save the forecasted values to DB
    for res in results:
        f_date = datetime.strptime(res["date"], "%Y-%m-%d").date()
        new_forecast = Forecast(
            crop_name=request.crop_name,
            forecast_period=f_date,
            predicted_demand=res["predicted_demand"],
            model_version="SARIMA_1.0"
        )
        db.add(new_forecast)
    db.commit()
    
    return ForecastResponse(crop_name=request.crop_name, forecasts=results)

@router.get("/accuracy")
def get_forecast_accuracy(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # This is a pandas-powered analytics endpoint that compares Forecasts vs SalesHistory
    # Get all forecasts that have a matching sales date
    query = """
        SELECT f.crop_name, f.forecast_period, f.predicted_demand, s.quantity_sold as actual_demand
        FROM forecasts f
        JOIN sales_history s ON f.crop_name = s.crop_name AND f.forecast_period = s.sale_date
    """
    df = pd.read_sql(query, db.bind)
    
    if df.empty:
        return {"message": "Not enough overlapping data yet to calculate accuracy."}
        
    # Calculate MAE (Mean Absolute Error) per crop
    df['error'] = abs(df['predicted_demand'] - df['actual_demand'])
    accuracy_metrics = df.groupby('crop_name')['error'].mean().reset_index()
    accuracy_metrics.rename(columns={'error': 'mae'}, inplace=True)
    
    return accuracy_metrics.to_dict(orient='records')
