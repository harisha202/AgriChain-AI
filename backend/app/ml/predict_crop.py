import joblib
import pandas as pd
import os

# Load model once when module is imported
model_path = os.path.join(os.path.dirname(__file__), 'crop_model.pkl')
try:
    model = joblib.load(model_path)
except Exception as e:
    print(f"Warning: Could not load crop model. Please train it first. {e}")
    model = None

def predict_crop(features: dict):
    if not model:
        raise Exception("Model not loaded. Train the model first.")
        
    df = pd.DataFrame([features])
    
    prediction = model.predict(df)[0]
    probabilities = model.predict_proba(df)[0]
    
    # Get the confidence score of the predicted class
    predicted_class_index = list(model.classes_).index(prediction)
    confidence = probabilities[predicted_class_index]
    
    return prediction, float(confidence)
