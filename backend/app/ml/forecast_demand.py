import joblib
import pandas as pd
import os
from datetime import datetime, timedelta

model_path = os.path.join(os.path.dirname(__file__), 'demand_model.pkl')
try:
    models = joblib.load(model_path)
except Exception as e:
    print(f"Warning: Could not load demand models. {e}")
    models = {}

def predict_future_demand(crop_name: str, days_ahead: int = 30):
    if crop_name not in models:
        raise ValueError(f"No forecasting model available for {crop_name}")
        
    model = models[crop_name]
    # Forecast the next N days
    forecast = model.forecast(steps=days_ahead)
    
    # Generate future dates
    last_date = datetime(2026, 1, 1) # Our synthetic data ends here
    dates = [last_date + timedelta(days=i) for i in range(1, days_ahead + 1)]
    
    results = []
    for date, demand in zip(dates, forecast):
        results.append({
            "date": date.strftime("%Y-%m-%d"),
            "predicted_demand": round(max(float(demand), 0), 2)
        })
        
    return results
