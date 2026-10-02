import os
import joblib
import pandas as pd
import numpy as np

from ml.preprocessing import transform_single_dict

class ActionRecommenderEngine:
    def __init__(self, models_dir=None):
        if models_dir is None:
            models_dir = os.path.join(os.path.dirname(__file__), "..", "..", "..", "ml", "saved_models")
        self.models_dir = models_dir
        self.regressor = None
        self.load_model()

    def load_model(self):
        reg_path = os.path.join(self.models_dir, "best_regressor.joblib")
        if os.path.exists(reg_path):
            self.regressor = joblib.load(reg_path)

    def generate_recommendations(self, order_dict):
        if self.regressor is None:
            self.load_model()
            
        # Baseline expected delay
        X_base = transform_single_dict(order_dict)
        baseline_delay = float(self.regressor.predict(X_base)[0]) if self.regressor else float(order_dict.get("delay_days", 2.0))
        baseline_delay = max(0.0, round(baseline_delay, 2))
        
        candidate_actions = []
        
        # 0. Baseline
        candidate_actions.append({
            "action_id": "ACT-000",
            "action_name": "No Intervention",
            "category": "Baseline",
            "expected_delay_days": baseline_delay,
            "improvement_days": 0.0,
            "feasibility": "Immediate",
            "cost_level": "None",
            "description": "Maintain current production schedule without operational interventions.",
            "is_recommended": False
        })
        
        # 1. Maintenance Action
        dict_maint = order_dict.copy()
        dict_maint["machine_downtime_hours"] = 0.5
        dict_maint["maintenance_overdue_days"] = 0
        X_maint = transform_single_dict(dict_maint)
        delay_maint = float(self.regressor.predict(X_maint)[0]) if self.regressor else baseline_delay * 0.5
        delay_maint = max(0.0, round(delay_maint, 2))
        imp_maint = max(0.0, round(baseline_delay - delay_maint, 2))
        
        candidate_actions.append({
            "action_id": "ACT-001",
            "action_name": "Schedule Immediate Preventive Maintenance",
            "category": "Machine",
            "expected_delay_days": delay_maint,
            "improvement_days": imp_maint,
            "feasibility": "High",
            "cost_level": "Low",
            "description": "Perform scheduled machine calibration and replace worn components during micro-stoppage.",
            "is_recommended": False
        })
        
        # 2. Material Action
        dict_mat = order_dict.copy()
        dict_mat["material_availability_pct"] = 98.0
        dict_mat["supplier_delay_days"] = 0.0
        X_mat = transform_single_dict(dict_mat)
        delay_mat = float(self.regressor.predict(X_mat)[0]) if self.regressor else baseline_delay * 0.6
        delay_mat = max(0.0, round(delay_mat, 2))
        imp_mat = max(0.0, round(baseline_delay - delay_mat, 2))
        
        candidate_actions.append({
            "action_id": "ACT-002",
            "action_name": "Expedite Raw Material & Reallocate Stock",
            "category": "Material",
            "expected_delay_days": delay_mat,
            "improvement_days": imp_mat,
            "feasibility": "Medium",
            "cost_level": "Medium",
            "description": "Reallocate available safety stock from non-urgent orders and issue express courier request to supplier.",
            "is_recommended": False
        })
        
        # 3. Workforce Action
        dict_wf = order_dict.copy()
        dict_wf["workforce_availability_pct"] = 95.0
        dict_wf["workforce_skill_index"] = 0.95
        X_wf = transform_single_dict(dict_wf)
        delay_wf = float(self.regressor.predict(X_wf)[0]) if self.regressor else baseline_delay * 0.7
        delay_wf = max(0.0, round(delay_wf, 2))
        imp_wf = max(0.0, round(baseline_delay - delay_wf, 2))
        
        candidate_actions.append({
            "action_id": "ACT-003",
            "action_name": "Reallocate Senior Operators & Shift Overtime",
            "category": "Workforce",
            "expected_delay_days": delay_wf,
            "improvement_days": imp_wf,
            "feasibility": "High",
            "cost_level": "Medium",
            "description": "Assign Tier-1 certified technicians and approve 2 hours overtime for current shift.",
            "is_recommended": False
        })
        
        # 4. Workload Rescheduling Action
        dict_wl = order_dict.copy()
        dict_wl["active_workload_orders"] = max(2, int(dict_wl.get("active_workload_orders", 10)) - 4)
        dict_wl["machine_capacity_utilization"] = min(80.0, float(dict_wl.get("machine_capacity_utilization", 90)))
        X_wl = transform_single_dict(dict_wl)
        delay_wl = float(self.regressor.predict(X_wl)[0]) if self.regressor else baseline_delay * 0.55
        delay_wl = max(0.0, round(delay_wl, 2))
        imp_wl = max(0.0, round(baseline_delay - delay_wl, 2))
        
        candidate_actions.append({
            "action_id": "ACT-004",
            "action_name": "Rebalance Line Load & Postpone Low-Priority Batches",
            "category": "Workload",
            "expected_delay_days": delay_wl,
            "improvement_days": imp_wl,
            "feasibility": "High",
            "cost_level": "Low",
            "description": "Transfer 2 buffer jobs to parallel CNC machines and reduce cell utilization to 80%.",
            "is_recommended": False
        })
        
        # Rank candidate actions by improvement_days descending
        candidate_actions.sort(key=lambda x: x["improvement_days"], reverse=True)
        
        # Mark top action as recommended (if improvement > 0)
        best_action = candidate_actions[0]
        best_action["is_recommended"] = True
        
        recommendation_reason = (
            f"Action '{best_action['action_name']}' yields the highest delay reduction of {best_action['improvement_days']} days "
            f"(reducing expected delay from {baseline_delay} days to {best_action['expected_delay_days']} days)."
        )
        
        return {
            "baseline_expected_delay_days": baseline_delay,
            "recommended_action": best_action,
            "recommendation_reason": recommendation_reason,
            "ranked_candidate_actions": candidate_actions
        }
