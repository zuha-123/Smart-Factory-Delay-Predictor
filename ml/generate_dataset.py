import numpy as np
import pandas as pd
import os

def generate_production_dataset(n_samples=2500, seed=42):
    """
    Generates a realistic manufacturing production dataset for delay prediction,
    root cause diagnosis, and preventive action evaluation.
    """
    np.random.seed(seed)
    
    order_ids = [f"ORD-{1000 + i}" for i in range(n_samples)]
    product_families = np.random.choice(
        ["Assembly_Alpha", "Component_Beta", "Engine_Gamma", "Hydraulic_Delta", "Precision_Gear"],
        size=n_samples,
        p=[0.25, 0.25, 0.20, 0.15, 0.15]
    )
    order_quantities = np.random.randint(50, 3500, size=n_samples)
    planned_durations = np.round(np.random.uniform(1.0, 14.0, size=n_samples), 1)
    
    priorities = np.random.choice(["Low", "Medium", "High", "Critical"], size=n_samples, p=[0.2, 0.4, 0.3, 0.1])
    shift_types = np.random.choice(["Day", "Night", "Rotating"], size=n_samples, p=[0.5, 0.3, 0.2])
    
    machine_utilization = np.round(np.random.uniform(45.0, 102.0, size=n_samples), 1)
    machine_downtime_hrs = np.round(np.random.exponential(scale=6.0, size=n_samples), 1)
    machine_downtime_hrs = np.clip(machine_downtime_hrs, 0.0, 48.0)
    
    maintenance_overdue_days = np.random.choice([0, 1, 2, 5, 8, 12, 20], size=n_samples, p=[0.45, 0.20, 0.15, 0.10, 0.05, 0.03, 0.02])
    
    material_availability_pct = np.round(np.random.uniform(40.0, 100.0, size=n_samples), 1)
    workforce_availability_pct = np.round(np.random.uniform(50.0, 100.0, size=n_samples), 1)
    workforce_skill_index = np.round(np.random.uniform(0.60, 1.00, size=n_samples), 2)
    active_workload_orders = np.random.randint(2, 18, size=n_samples)
    supplier_delay_days = np.round(np.random.exponential(scale=1.2, size=n_samples), 1)
    supplier_delay_days = np.clip(supplier_delay_days, 0.0, 8.0)
    
    # Calculate Ground Truth Delay Logit (Non-linear domain relationships)
    # 1. Machine Overload & Downtime Contribution
    util_risk = np.where(machine_utilization > 85.0, (machine_utilization - 85.0) * 0.08, 0.0)
    downtime_risk = machine_downtime_hrs * 0.09 + maintenance_overdue_days * 0.12
    
    # 2. Material Shortage Contribution
    material_risk = np.where(material_availability_pct < 85.0, (85.0 - material_availability_pct) * 0.07, 0.0) + supplier_delay_days * 0.25
    
    # 3. Workforce Shortage Contribution
    workforce_risk = np.where(workforce_availability_pct < 80.0, (80.0 - workforce_availability_pct) * 0.06, 0.0) + (1.0 - workforce_skill_index) * 1.5
    
    # 4. Workload Overload Contribution
    workload_risk = np.where(active_workload_orders > 10, (active_workload_orders - 10) * 0.18, 0.0)
    
    # Total Logit Score
    logit = -2.8 + util_risk + downtime_risk + material_risk + workforce_risk + workload_risk + np.random.normal(0, 0.4, size=n_samples)
    
    # Probability via Sigmoid
    prob_delayed = 1.0 / (1.0 + np.exp(-logit))
    
    # Binary target
    is_delayed = (prob_delayed > 0.48).astype(int)
    
    # Delay Duration calculation (Regression target)
    base_delay = (
        0.05 * machine_downtime_hrs +
        0.04 * maintenance_overdue_days +
        0.04 * np.maximum(0, 85.0 - material_availability_pct) +
        0.03 * np.maximum(0, 80.0 - workforce_availability_pct) +
        0.12 * supplier_delay_days +
        0.10 * np.maximum(0, active_workload_orders - 8)
    )
    
    delay_days = np.where(is_delayed == 1, np.round(base_delay + np.random.gamma(shape=2.0, scale=0.6, size=n_samples), 1), 0.0)
    delay_days = np.clip(delay_days, 0.0, 18.0)
    
    df = pd.DataFrame({
        "order_id": order_ids,
        "product_family": product_families,
        "order_quantity": order_quantities,
        "planned_duration_days": planned_durations,
        "order_priority": priorities,
        "shift_type": shift_types,
        "machine_capacity_utilization": machine_utilization,
        "machine_downtime_hours": machine_downtime_hrs,
        "maintenance_overdue_days": maintenance_overdue_days,
        "material_availability_pct": material_availability_pct,
        "workforce_availability_pct": workforce_availability_pct,
        "workforce_skill_index": workforce_skill_index,
        "active_workload_orders": active_workload_orders,
        "supplier_delay_days": supplier_delay_days,
        "is_delayed": is_delayed,
        "delay_days": delay_days
    })
    
    return df

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(out_dir, exist_ok=True)
    file_path = os.path.join(out_dir, "production_delay_dataset.csv")
    df = generate_production_dataset(2500, seed=42)
    df.to_csv(file_path, index=False)
    print(f"Dataset generated successfully at {file_path} with shape: {df.shape}")
    print("Class Distribution:\n", df['is_delayed'].value_counts(normalize=True))
