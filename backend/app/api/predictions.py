from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import json

from backend.app.core.database import get_db
from backend.app.models.db_models import (
    ProductionOrder, Prediction, RiskScore, RootCause, Recommendation, AuditLog
)
from backend.app.schemas.api_schemas import (
    ProductionOrderCreate, CustomPredictRequest, OrderPredictionFullOut
)
from backend.app.api.auth import get_current_user
from ml.explainer import RootCauseExplainer
from backend.app.risk_engine.risk_calculator import calculate_dynamic_risk_score
from backend.app.recommendation_engine.action_recommender import ActionRecommenderEngine

router = APIRouter(prefix="", tags=["AI Prediction & Diagnosis"])

explainer_engine = RootCauseExplainer()
recommender_engine = ActionRecommenderEngine()

def run_full_pipeline_on_dict(order_dict: dict):
    # 1. SHAP & Classification Prediction
    shap_res = explainer_engine.explain_order(order_dict)
    prob = shap_res["delay_probability"]
    is_delayed = prob >= 50.0
    
    # 2. Action Recommender & Baseline Regressor Prediction
    rec_res = recommender_engine.generate_recommendations(order_dict)
    expected_delay = rec_res["baseline_expected_delay_days"]
    
    # 3. Dynamic Risk Score
    risk_res = calculate_dynamic_risk_score(
        delay_probability=prob,
        expected_delay_days=expected_delay,
        machine_utilization=float(order_dict.get("machine_capacity_utilization", 80.0)),
        machine_downtime_hrs=float(order_dict.get("machine_downtime_hours", 0.0)),
        material_availability_pct=float(order_dict.get("material_availability_pct", 90.0)),
        workforce_availability_pct=float(order_dict.get("workforce_availability_pct", 90.0)),
        active_workload_orders=int(order_dict.get("active_workload_orders", 5))
    )
    
    return {
        "order_id": order_dict.get("order_id", "CUSTOM-SIM"),
        "delay_probability": prob,
        "is_delayed_predicted": is_delayed,
        "expected_delay_days": expected_delay,
        "risk": risk_res,
        "root_cause": shap_res,
        "recommendations": rec_res
    }

@router.post("/prediction/simulate", response_model=OrderPredictionFullOut)
def simulate_custom_prediction(
    custom_in: CustomPredictRequest,
    current_user = Depends(get_current_user)
):
    order_dict = custom_in.dict()
    result = run_full_pipeline_on_dict(order_dict)
    return result

@router.post("/prediction/{order_id}", response_model=OrderPredictionFullOut)
def predict_order_by_id(
    order_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    order = db.query(ProductionOrder).filter(ProductionOrder.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Production Order '{order_id}' not found.")
        
    order_dict = {
        "order_id": order.order_id,
        "product_family": order.product_family,
        "order_quantity": order.order_quantity,
        "planned_duration_days": order.planned_duration_days,
        "order_priority": order.order_priority,
        "shift_type": order.shift_type,
        "machine_capacity_utilization": order.machine_capacity_utilization,
        "machine_downtime_hours": order.machine_downtime_hours,
        "maintenance_overdue_days": order.maintenance_overdue_days,
        "material_availability_pct": order.material_availability_pct,
        "supplier_delay_days": order.supplier_delay_days,
        "workforce_availability_pct": order.workforce_availability_pct,
        "workforce_skill_index": order.workforce_skill_index,
        "active_workload_orders": order.active_workload_orders
    }
    
    res = run_full_pipeline_on_dict(order_dict)
    
    # Save or update Prediction record in DB
    existing_pred = db.query(Prediction).filter(Prediction.order_db_id == order.id).first()
    if existing_pred:
        db.delete(existing_pred)
        db.commit()
        
    pred_rec = Prediction(
        order_db_id=order.id,
        delay_probability=res["delay_probability"],
        is_delayed_predicted=res["is_delayed_predicted"],
        expected_delay_days=res["expected_delay_days"]
    )
    db.add(pred_rec)
    db.commit()
    db.refresh(pred_rec)
    
    # Save Risk Score
    risk_rec = RiskScore(
        prediction_id=pred_rec.id,
        risk_score=res["risk"]["risk_score"],
        risk_category=res["risk"]["risk_category"],
        breakdown_json=json.dumps(res["risk"]["components"])
    )
    db.add(risk_rec)
    
    # Save Root Cause
    rc_data = res["root_cause"]
    primary_label = rc_data["primary_cause"]["label"] if rc_data["primary_cause"] else "None"
    primary_pct = rc_data["primary_cause"]["contribution_pct"] if rc_data["primary_cause"] else 0.0
    
    rc_rec = RootCause(
        prediction_id=pred_rec.id,
        primary_cause=primary_label,
        primary_cause_pct=primary_pct,
        secondary_causes_json=json.dumps(rc_data["secondary_causes"]),
        human_explanation=rc_data["human_explanation"]
    )
    db.add(rc_rec)
    
    # Save Recommendations
    for rec_item in res["recommendations"]["ranked_candidate_actions"]:
        r_rec = Recommendation(
            prediction_id=pred_rec.id,
            action_name=rec_item["action_name"],
            expected_delay_days=rec_item["expected_delay_days"],
            improvement_days=rec_item["improvement_days"],
            is_recommended=rec_item["is_recommended"],
            reason=res["recommendations"]["recommendation_reason"] if rec_item["is_recommended"] else None
        )
        db.add(r_rec)
        
    log = AuditLog(user_email=current_user.email, action="RUN_PREDICTION", details=f"Predicted for order {order_id}: {res['risk']['risk_category']} Risk")
    db.add(log)
    db.commit()
    
    return res

@router.get("/prediction/{order_id}", response_model=OrderPredictionFullOut)
def get_prediction_by_id(
    order_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return predict_order_by_id(order_id=order_id, db=db, current_user=current_user)

@router.get("/risk/{order_id}")
def get_order_risk(order_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    res = predict_order_by_id(order_id=order_id, db=db, current_user=current_user)
    return res["risk"]

@router.get("/root-cause/{order_id}")
def get_order_root_cause(order_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    res = predict_order_by_id(order_id=order_id, db=db, current_user=current_user)
    return res["root_cause"]

@router.get("/recommendations/{order_id}")
def get_order_recommendations(order_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    res = predict_order_by_id(order_id=order_id, db=db, current_user=current_user)
    return res["recommendations"]
