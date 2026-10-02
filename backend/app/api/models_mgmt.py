from fastapi import APIRouter, Depends, HTTPException, status
import os
import json
from backend.app.api.auth import get_current_user, require_role
from ml.train_models import train_and_evaluate_all

router = APIRouter(prefix="/model-performance", tags=["ML Models Performance"])

METRICS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "ml", "saved_models", "metrics_summary.json")

@router.get("")
def get_model_performance(current_user = Depends(get_current_user)):
    if not os.path.exists(METRICS_PATH):
        # Train models if metrics summary doesn't exist yet
        return train_and_evaluate_all()
    with open(METRICS_PATH, "r") as f:
        data = json.load(f)
    return data

@router.post("/retrain")
def retrain_ml_models(current_user = Depends(require_role(["Admin", "Analyst"]))):
    summary = train_and_evaluate_all()
    return {
        "status": "success",
        "message": "Successfully retrained and evaluated all ML classification and regression models.",
        "summary": summary
    }
