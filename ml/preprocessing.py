import pandas as pd
import numpy as np
import joblib
import os

PRIORITY_MAP = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}
SHIFT_MAP = {"Day": 1, "Night": 2, "Rotating": 3}
PRODUCT_MAP = {
    "Assembly_Alpha": 1,
    "Component_Beta": 2,
    "Engine_Gamma": 3,
    "Hydraulic_Delta": 4,
    "Precision_Gear": 5
}

FEATURE_COLUMNS = [
    "order_quantity",
    "planned_duration_days",
    "order_priority_num",
    "shift_type_num",
    "product_family_num",
    "machine_capacity_utilization",
    "machine_downtime_hours",
    "maintenance_overdue_days",
    "material_availability_pct",
    "workforce_availability_pct",
    "workforce_skill_index",
    "active_workload_orders",
    "supplier_delay_days"
]

def preprocess_dataframe(df):
    """
    Transforms raw manufacturing dataframe into ML feature matrix X.
    """
    df = df.copy()
    
    # Map categorical features
    if "order_priority_num" not in df.columns:
        df["order_priority_num"] = df["order_priority"].map(PRIORITY_MAP).fillna(2)
    if "shift_type_num" not in df.columns:
        df["shift_type_num"] = df["shift_type"].map(SHIFT_MAP).fillna(1)
    if "product_family_num" not in df.columns:
        df["product_family_num"] = df["product_family"].map(PRODUCT_MAP).fillna(1)
        
    # Fill any missing numerical values with median defaults
    df["order_quantity"] = df["order_quantity"].fillna(500)
    df["planned_duration_days"] = df["planned_duration_days"].fillna(5.0)
    df["machine_capacity_utilization"] = df["machine_capacity_utilization"].fillna(75.0)
    df["machine_downtime_hours"] = df["machine_downtime_hours"].fillna(0.0)
    df["maintenance_overdue_days"] = df["maintenance_overdue_days"].fillna(0)
    df["material_availability_pct"] = df["material_availability_pct"].fillna(90.0)
    df["workforce_availability_pct"] = df["workforce_availability_pct"].fillna(90.0)
    df["workforce_skill_index"] = df["workforce_skill_index"].fillna(0.85)
    df["active_workload_orders"] = df["active_workload_orders"].fillna(5)
    df["supplier_delay_days"] = df["supplier_delay_days"].fillna(0.0)
    
    X = df[FEATURE_COLUMNS].astype(float)
    return X, df

def save_preprocessor(out_dir):
    os.makedirs(out_dir, exist_ok=True)
    meta = {
        "priority_map": PRIORITY_MAP,
        "shift_map": SHIFT_MAP,
        "product_map": PRODUCT_MAP,
        "feature_columns": FEATURE_COLUMNS
    }
    joblib.dump(meta, os.path.join(out_dir, "preprocessor_meta.joblib"))

def transform_single_dict(data_dict):
    """
    Transforms a single production order dict into a 1-row DataFrame matching FEATURE_COLUMNS.
    """
    df = pd.DataFrame([data_dict])
    X, _ = preprocess_dataframe(df)
    return X
