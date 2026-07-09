from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.crop_query import CropQuery
from app.schemas.crop_schema import CropPredictionRequest, CropPredictionResponse
from app.ml.predict_crop import predict_crop
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/crop", tags=["crop"])

CROP_INSIGHTS = {
    "rice": {"season": "Kharif (Monsoon)", "duration": "120-150 days", "insight": "Requires heavy rainfall and high temperatures. Thrives in waterlogged soil."},
    "maize": {"season": "Kharif / Zaid", "duration": "90-110 days", "insight": "Prefers moderate rainfall and warm weather. Highly sensitive to frost."},
    "chickpea": {"season": "Rabi (Winter)", "duration": "90-120 days", "insight": "Thrives in cooler climates with minimal rainfall; excess moisture causes rot."},
    "kidneybeans": {"season": "Kharif", "duration": "100-120 days", "insight": "Requires well-distributed rainfall and cool to moderate temperatures."},
    "pigeonpeas": {"season": "Kharif", "duration": "150-180 days", "insight": "Highly drought tolerant, requires warm temperatures and minimal rainfall."},
    "mothbeans": {"season": "Kharif", "duration": "60-90 days", "insight": "Extremely drought resistant, grown in hot and dry climates."},
    "mungbean": {"season": "Kharif / Zaid", "duration": "65-90 days", "insight": "Needs warm climate and moderate rainfall. Intolerant to waterlogging."},
    "blackgram": {"season": "Kharif", "duration": "90-120 days", "insight": "Grows best in hot and humid conditions with moderate rainfall."},
    "lentil": {"season": "Rabi", "duration": "110-120 days", "insight": "Requires cold temperatures during vegetative growth and warm temperatures at maturity."},
    "pomegranate": {"season": "Perennial", "duration": "120-140 days (fruiting)", "insight": "Highly drought tolerant. Thrives in hot, dry summers and cold winters."},
    "banana": {"season": "Perennial", "duration": "12-15 months", "insight": "Requires high humidity, warm temperatures, and abundant rainfall throughout the year."},
    "mango": {"season": "Perennial", "duration": "100-150 days (fruiting)", "insight": "Needs a dry period before flowering, followed by warm and humid conditions."},
    "grapes": {"season": "Perennial", "duration": "100-120 days (fruiting)", "insight": "Requires a long, warm, dry summer and a cool winter for dormancy."},
    "watermelon": {"season": "Zaid (Summer)", "duration": "80-100 days", "insight": "Thrives in hot, dry climates with abundant sunshine and moderate water."},
    "muskmelon": {"season": "Zaid (Summer)", "duration": "80-100 days", "insight": "Needs warm weather and plenty of sunlight. Sensitive to frost and high humidity."},
    "apple": {"season": "Perennial", "duration": "130-150 days (fruiting)", "insight": "Requires a high chilling requirement (cold winters) and mild summers."},
    "orange": {"season": "Perennial", "duration": "200-300 days (fruiting)", "insight": "Grows best in subtropical climates with moderate rainfall and distinct wet/dry seasons."},
    "papaya": {"season": "Perennial", "duration": "10-14 months", "insight": "Needs tropical, warm, and humid climates. Very sensitive to frost and waterlogging."},
    "coconut": {"season": "Perennial", "duration": "11-12 months (fruiting)", "insight": "Requires an equatorial climate with high humidity and evenly distributed heavy rainfall."},
    "cotton": {"season": "Kharif", "duration": "150-180 days", "insight": "Needs clear sunny days for flowering and moderate rainfall during early vegetative growth."},
    "jute": {"season": "Kharif", "duration": "120-150 days", "insight": "Requires a hot and humid climate with abundant and well-distributed rainfall."},
    "coffee": {"season": "Perennial", "duration": "3-4 years (first harvest)", "insight": "Needs well-distributed rainfall and cool, shaded environments to prevent heat stress."}
}

@router.post("/predict", response_model=CropPredictionResponse)
def predict(request: CropPredictionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        prediction, confidence = predict_crop(request.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    # Save query to DB
    new_query = CropQuery(
        user_id=current_user.id,
        N=request.N,
        P=request.P,
        K=request.K,
        temperature=request.temperature,
        humidity=request.humidity,
        ph=request.ph,
        rainfall=request.rainfall,
        predicted_crop=prediction,
        confidence=confidence
    )
    db.add(new_query)
    db.commit()
    
    insight_data = CROP_INSIGHTS.get(prediction.lower(), {
        "season": "Varies by region", 
        "duration": "Depends on variety", 
        "insight": "Consult local agricultural guidelines for precise climatic requirements."
    })
    
    return CropPredictionResponse(
        predicted_crop=prediction, 
        confidence=confidence,
        optimal_season=insight_data["season"],
        growth_duration=insight_data["duration"],
        weather_insight=insight_data["insight"]
    )
