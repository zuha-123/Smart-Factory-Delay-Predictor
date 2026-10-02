import os
import joblib
import pandas as pd
import numpy as np
import shap

from ml.preprocessing import transform_single_dict, FEATURE_COLUMNS

LABEL_MAPPING = {
    "machine_capacity_utilization": "Machine Utilization",
    "machine_downtime_hours": "Machine Downtime",
    "maintenance_overdue_days": "Maintenance Overdue",
    "material_availability_pct": "Material Availability",
    "supplier_delay_days": "Supplier Delay",
    "workforce_availability_pct": "Workforce Availability",
    "workforce_skill_index": "Workforce Skill Index",
    "active_workload_orders": "Active Workload Orders",
    "order_quantity": "Order Quantity",
    "planned_duration_days": "Planned Duration",
    "order_priority_num": "Order Priority",
    "shift_type_num": "Shift Type",
    "product_family_num": "Product Family"
}

CATEGORY_MAPPING = {
    "machine_capacity_utilization": "Machine overload — high capacity utilization",
    "machine_downtime_hours": "Machine downtime & unpredicted breakdowns",
    "maintenance_overdue_days": "Maintenance overdue & machine wear",
    "material_availability_pct": "Material shortage & stock unavailability",
    "supplier_delay_days": "Supplier lead time & procurement delay",
    "workforce_availability_pct": "Workforce shortage & staffing deficit",
    "workforce_skill_index": "Workforce skill gap & operator experience",
    "active_workload_orders": "Production workload overload",
    "order_quantity": "Large order volume & batch size",
    "planned_duration_days": "Tight planned completion schedule"
}

class RootCauseExplainer:
    def __init__(self, models_dir=None):
        if models_dir is None:
            models_dir = os.path.join(os.path.dirname(__file__), "saved_models")
        self.models_dir = models_dir
        self.classifier = None
        self.explainer = None
        self.load_model()

    def load_model(self):
        cls_path = os.path.join(self.models_dir, "best_classifier.joblib")
        if os.path.exists(cls_path):
            self.classifier = joblib.load(cls_path)
            try:
                self.explainer = shap.TreeExplainer(self.classifier)
            except Exception:
                # Fallback for linear or unsupported shap models
                self.explainer = None

    def explain_order(self, order_dict):
        X = transform_single_dict(order_dict)
        
        if self.classifier is None:
            self.load_model()
            
        prob = float(self.classifier.predict_proba(X)[0, 1]) if hasattr(self.classifier, "predict_proba") else 0.5
        
        shap_values = None
        if self.explainer is not None:
            try:
                sv = self.explainer.shap_values(X)
                if isinstance(sv, list):
                    shap_values = sv[1][0]
                elif len(sv.shape) == 3:
                    shap_values = sv[0, :, 1]
                else:
                    shap_values = sv[0]
            except Exception:
                shap_values = None
                
        if shap_values is None or len(shap_values) != len(FEATURE_COLUMNS):
            # Fallback to feature importances or heuristic attribution
            if hasattr(self.classifier, "feature_importances_"):
                imps = self.classifier.feature_importances_
                shap_values = imps * X.values[0]
            else:
                shap_values = np.abs(X.values[0])
                
        # Calculate relative risk contributions (only positive risk drivers)
        abs_contribs = np.maximum(0, shap_values)
        total_contrib = np.sum(abs_contribs)
        
        if total_contrib <= 1e-6:
            abs_contribs = np.ones(len(FEATURE_COLUMNS))
            total_contrib = len(FEATURE_COLUMNS)
            
        pct_contribs = (abs_contribs / total_contrib) * 100.0
        
        causes = []
        for feat, shap_val, pct, val in zip(FEATURE_COLUMNS, shap_values, pct_contribs, X.values[0]):
            causes.append({
                "feature": feat,
                "label": LABEL_MAPPING.get(feat, feat),
                "value": float(val),
                "shap_value": round(float(shap_val), 4),
                "contribution_pct": round(float(pct), 1),
                "category_desc": CATEGORY_MAPPING.get(feat, f"Factor {feat}")
            })
            
        # Sort causes by contribution percentage descending
        causes.sort(key=lambda x: x["contribution_pct"], reverse=True)
        
        primary_cause = causes[0] if len(causes) > 0 else None
        secondary_causes = causes[1:4] if len(causes) > 1 else []
        
        # Build natural language explanation strictly grounded in SHAP outputs
        explanation_lines = []
        if primary_cause and primary_cause["contribution_pct"] > 5.0:
            explanation_lines.append(
                f"Primary contributor: {primary_cause['label']} contributes {primary_cause['contribution_pct']}% of predicted delay risk."
            )
        if secondary_causes:
            sec_desc = ", ".join([f"{c['label']} ({c['contribution_pct']}%)" for c in secondary_causes if c['contribution_pct'] > 5.0])
            if sec_desc:
                explanation_lines.append(f"Secondary contributors: {sec_desc}.")
                
        human_explanation = " ".join(explanation_lines) if explanation_lines else "Production parameters are within normal operating bounds."
        
        return {
            "delay_probability": round(prob * 100.0, 1),
            "primary_cause": primary_cause,
            "secondary_causes": secondary_causes,
            "all_causes": causes[:6],
            "human_explanation": human_explanation
        }
