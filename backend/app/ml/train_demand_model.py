import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import joblib
import os
from sqlalchemy import create_engine
from statsmodels.tsa.statespace.sarimax import SARIMAX

# Generate 2 years of synthetic sales data with seasonality
def generate_sales_data():
    np.random.seed(42)
    crops = ['rice', 'maize', 'chickpea']
    regions = ['North', 'South', 'East', 'West']
    
    start_date = datetime(2024, 1, 1)
    end_date = datetime(2026, 1, 1)
    dates = pd.date_range(start_date, end_date, freq='D')
    
    data = []
    for crop in crops:
        base_demand = np.random.randint(500, 2000)
        # Create a seasonal pattern (e.g. peak in summer)
        seasonality = np.sin(np.linspace(0, 4 * np.pi, len(dates))) * 300
        trend = np.linspace(0, 500, len(dates)) # General growth trend
        noise = np.random.normal(0, 100, len(dates))
        
        daily_demand = np.maximum(base_demand + seasonality + trend + noise, 0)
        
        for i, date in enumerate(dates):
            # Split demand roughly across regions
            for region in regions:
                qty = max(10, int(daily_demand[i] * np.random.uniform(0.1, 0.4)))
                price = np.random.uniform(1.5, 3.5)
                data.append({
                    'crop_name': crop,
                    'quantity_sold': qty,
                    'sale_date': date,
                    'region': region,
                    'price_per_kg': price
                })
                
    return pd.DataFrame(data)

def train_and_save_models(df):
    model_dir = os.path.dirname(__file__)
    models = {}
    
    # Train a separate SARIMA model for each crop's aggregate daily demand
    for crop in df['crop_name'].unique():
        print(f"Training demand model for {crop}...")
        crop_df = df[df['crop_name'] == crop]
        daily_series = crop_df.groupby('sale_date')['quantity_sold'].sum().resample('D').sum()
        
        # Fit SARIMA model (order 1,1,1) with weekly seasonality (7)
        model = SARIMAX(daily_series, order=(1, 1, 1), seasonal_order=(1, 0, 0, 7))
        fitted_model = model.fit(disp=False)
        models[crop] = fitted_model
        
    model_path = os.path.join(model_dir, 'demand_model.pkl')
    joblib.dump(models, model_path)
    print(f"Saved demand forecasting models to {model_path}")
    return models

if __name__ == "__main__":
    print("Generating synthetic sales history...")
    df = generate_sales_data()
    
    # Save to SQLite DB for the Analytics dashboard to use
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'agrichain.db'))
    engine = create_engine(f"sqlite:///{db_path}")
    
    print(f"Populating sales_history table in {db_path}...")
    # Add index 'id' as required by SQLAlchemy models
    df.index += 1
    df.index.name = 'id'
    df.to_sql('sales_history', con=engine, if_exists='append', index=True)
    
    print("Training time-series demand models...")
    train_and_save_models(df)
