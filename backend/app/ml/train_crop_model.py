import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

# Generate synthetic dataset mirroring the Kaggle Crop Recommendation dataset
# Features: N, P, K, temperature, humidity, ph, rainfall
# Target: label (crop name)
def generate_synthetic_crop_data(samples_per_crop=100):
    crops = {
        'rice': {'N': (60,95), 'P': (35,60), 'K': (35,45), 'temp': (20,28), 'hum': (80,85), 'ph': (5.5,7), 'rain': (150,300)},
        'maize': {'N': (60,100), 'P': (35,60), 'K': (15,25), 'temp': (18,28), 'hum': (50,75), 'ph': (5.5,7), 'rain': (60,110)},
        'chickpea': {'N': (20,60), 'P': (55,80), 'K': (75,85), 'temp': (15,22), 'hum': (10,20), 'ph': (5.5,8), 'rain': (60,90)},
        'kidneybeans': {'N': (0,40), 'P': (55,80), 'K': (15,25), 'temp': (15,25), 'hum': (10,30), 'ph': (5.5,6), 'rain': (60,150)},
        'pigeonpeas': {'N': (0,40), 'P': (55,80), 'K': (15,25), 'temp': (18,38), 'hum': (30,70), 'ph': (4.5,7.5), 'rain': (90,200)},
        'mothbeans': {'N': (0,40), 'P': (35,60), 'K': (15,25), 'temp': (24,32), 'hum': (40,65), 'ph': (3.5,10), 'rain': (30,75)},
        'mungbean': {'N': (0,40), 'P': (35,60), 'K': (15,25), 'temp': (27,30), 'hum': (80,90), 'ph': (6.5,7.2), 'rain': (35,60)},
        'blackgram': {'N': (20,60), 'P': (55,80), 'K': (15,25), 'temp': (25,35), 'hum': (60,70), 'ph': (6.5,7.8), 'rain': (60,75)},
        'lentil': {'N': (0,40), 'P': (55,80), 'K': (15,25), 'temp': (18,30), 'hum': (60,70), 'ph': (5.5,7.8), 'rain': (35,55)},
        'pomegranate': {'N': (0,40), 'P': (5,30), 'K': (35,45), 'temp': (18,25), 'hum': (80,95), 'ph': (5.5,7.2), 'rain': (100,115)},
        'banana': {'N': (80,120), 'P': (70,95), 'K': (45,55), 'temp': (25,30), 'hum': (75,85), 'ph': (5.5,6.5), 'rain': (90,120)},
        'mango': {'N': (0,40), 'P': (15,40), 'K': (25,35), 'temp': (27,36), 'hum': (45,55), 'ph': (4.5,7), 'rain': (85,105)},
        'grapes': {'N': (0,40), 'P': (120,145), 'K': (195,205), 'temp': (8,42), 'hum': (80,85), 'ph': (5.5,6.5), 'rain': (65,75)},
        'watermelon': {'N': (80,120), 'P': (5,30), 'K': (45,55), 'temp': (24,27), 'hum': (80,90), 'ph': (6.0,6.5), 'rain': (40,60)},
        'muskmelon': {'N': (80,120), 'P': (5,30), 'K': (45,55), 'temp': (27,30), 'hum': (90,95), 'ph': (6.0,6.5), 'rain': (20,30)},
        'apple': {'N': (0,40), 'P': (120,145), 'K': (195,205), 'temp': (21,24), 'hum': (90,95), 'ph': (5.5,6.5), 'rain': (100,125)},
        'orange': {'N': (0,40), 'P': (5,30), 'K': (5,15), 'temp': (10,35), 'hum': (90,95), 'ph': (6.0,7.5), 'rain': (100,120)},
        'papaya': {'N': (35,70), 'P': (40,70), 'K': (40,55), 'temp': (23,33), 'hum': (90,95), 'ph': (6.5,6.7), 'rain': (40,250)},
        'coconut': {'N': (0,40), 'P': (5,30), 'K': (25,35), 'temp': (25,30), 'hum': (90,100), 'ph': (5.5,6.5), 'rain': (130,225)},
        'cotton': {'N': (100,140), 'P': (35,60), 'K': (15,25), 'temp': (22,26), 'hum': (75,85), 'ph': (5.8,7.5), 'rain': (60,100)},
        'jute': {'N': (60,100), 'P': (35,60), 'K': (35,45), 'temp': (23,27), 'hum': (70,90), 'ph': (6.0,7.5), 'rain': (150,200)},
        'coffee': {'N': (80,120), 'P': (15,40), 'K': (25,35), 'temp': (23,28), 'hum': (50,70), 'ph': (6.0,7.5), 'rain': (110,200)}
    }
    
    data = []
    for crop, ranges in crops.items():
        for _ in range(samples_per_crop):
            data.append({
                'N': np.random.uniform(ranges['N'][0], ranges['N'][1]),
                'P': np.random.uniform(ranges['P'][0], ranges['P'][1]),
                'K': np.random.uniform(ranges['K'][0], ranges['K'][1]),
                'temperature': np.random.uniform(ranges['temp'][0], ranges['temp'][1]),
                'humidity': np.random.uniform(ranges['hum'][0], ranges['hum'][1]),
                'ph': np.random.uniform(ranges['ph'][0], ranges['ph'][1]),
                'rainfall': np.random.uniform(ranges['rain'][0], ranges['rain'][1]),
                'label': crop
            })
            
    return pd.DataFrame(data)

if __name__ == "__main__":
    print("Generating synthetic crop dataset...")
    df = generate_synthetic_crop_data(samples_per_crop=100)
    
    X = df.drop('label', axis=1)
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestClassifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    accuracy = model.score(X_test, y_test)
    print(f"Model trained with accuracy: {accuracy:.2f}")
    
    model_path = os.path.join(os.path.dirname(__file__), 'crop_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")
