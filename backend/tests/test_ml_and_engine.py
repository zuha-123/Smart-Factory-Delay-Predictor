import sys
import os
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from ml.generate_dataset import generate_production_dataset
from backend.app.risk_engine.risk_calculator import calculate_dynamic_risk_score
from ml.explainer import RootCauseExplainer
from backend.app.recommendation_engine.action_recommender import ActionRecommenderEngine

def test_dataset_generator():
    df = generate_production_dataset(100, seed=123)
    assert len(df) == 100
    assert "is_delayed" in df.columns
    assert "delay_days" in df.columns
    assert "machine_capacity_utilization" in df.columns

def test_risk_calculator():
    # High risk inputs
    risk = calculate_dynamic_risk_score(
        delay_probability=90.0,
        expected_delay_days=6.0,
        machine_utilization=98.0,
        machine_downtime_hrs=20.0,
        material_availability_pct=40.0,
        workforce_availability_pct=50.0,
        active_workload_orders=15
    )
    assert risk["risk_score"] > 60.0
    assert risk["risk_category"] in ["HIGH", "CRITICAL"]

def test_explainer_and_recommender():
    order_dict = {
        "order_id": "TEST-101",
        "product_family": "Engine_Gamma",
        "order_quantity": 1000,
        "planned_duration_days": 5.0,
        "order_priority": "High",
        "shift_type": "Day",
        "machine_capacity_utilization": 95.0,
        "machine_downtime_hours": 15.0,
        "maintenance_overdue_days": 10,
        "material_availability_pct": 50.0,
        "supplier_delay_days": 4.0,
        "workforce_availability_pct": 60.0,
        "workforce_skill_index": 0.70,
        "active_workload_orders": 12
    }
    
    explainer = RootCauseExplainer()
    explanation = explainer.explain_order(order_dict)
    assert explanation["delay_probability"] > 0
    assert len(explanation["all_causes"]) > 0
    
    recommender = ActionRecommenderEngine()
    recs = recommender.generate_recommendations(order_dict)
    assert len(recs["ranked_candidate_actions"]) == 5
    assert recs["recommended_action"]["is_recommended"] == True
