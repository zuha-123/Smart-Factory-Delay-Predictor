import numpy as np

def calculate_dynamic_risk_score(
    delay_probability,
    expected_delay_days,
    machine_utilization,
    machine_downtime_hrs,
    material_availability_pct,
    workforce_availability_pct,
    active_workload_orders
):
    """
    Computes transparent, dynamic production risk score (0 to 100)
    with configurable category thresholds:
    0 - 25: LOW
    26 - 50: MEDIUM
    51 - 75: HIGH
    76 - 100: CRITICAL
    """
    # 1. Probability component (35%)
    prob_score = delay_probability  # 0 to 100
    
    # 2. Duration severity component (25%)
    # 8+ days maxes out at 100
    dur_score = min(100.0, (expected_delay_days / 8.0) * 100.0)
    
    # 3. Machine Risk Factor (15%)
    m_util_risk = max(0.0, (machine_utilization - 75.0) * 3.33)
    m_down_risk = min(100.0, (machine_downtime_hrs / 24.0) * 100.0)
    machine_risk = min(100.0, 0.5 * m_util_risk + 0.5 * m_down_risk)
    
    # 4. Material Risk Factor (15%)
    material_risk = max(0.0, (100.0 - material_availability_pct) * 2.0)
    material_risk = min(100.0, material_risk)
    
    # 5. Workforce & Workload Risk Factor (10%)
    wf_risk = max(0.0, (100.0 - workforce_availability_pct) * 2.0)
    wl_risk = min(100.0, max(0.0, (active_workload_orders - 5) * 10.0))
    workforce_workload_risk = min(100.0, 0.5 * wf_risk + 0.5 * wl_risk)
    
    total_score = (
        0.35 * prob_score +
        0.25 * dur_score +
        0.15 * machine_risk +
        0.15 * material_risk +
        0.10 * workforce_workload_risk
    )
    
    score_final = round(float(np.clip(total_score, 0.0, 100.0)), 1)
    
    if score_final <= 25.0:
        category = "LOW"
    elif score_final <= 50.0:
        category = "MEDIUM"
    elif score_final <= 75.0:
        category = "HIGH"
    else:
        category = "CRITICAL"
        
    return {
        "risk_score": score_final,
        "risk_category": category,
        "components": {
            "probability_weight": round(0.35 * prob_score, 1),
            "duration_weight": round(0.25 * dur_score, 1),
            "machine_weight": round(0.15 * machine_risk, 1),
            "material_weight": round(0.15 * material_risk, 1),
            "workforce_workload_weight": round(0.10 * workforce_workload_risk, 1)
        }
    }
