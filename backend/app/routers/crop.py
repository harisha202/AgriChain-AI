from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.crop_query import CropQuery
from app.schemas.crop_schema import CropPredictionRequest, CropPredictionResponse
from app.ml.predict_crop import predict_crop
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/crop", tags=["crop"])

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
    
    return CropPredictionResponse(predicted_crop=prediction, confidence=confidence)
