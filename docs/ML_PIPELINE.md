# Machine Learning Pipeline Documentation

## Overview
The ML pipeline consists of automated dataset generation, preprocessing, model training, cross-validation model selection, and SHAP explainability.

## 1. Feature Engineering & Preprocessing
Feature matrix $X$ consists of 13 standardized operational metrics:
- `order_quantity`, `planned_duration_days`
- Categoricals mapped: `order_priority_num` (1..4), `shift_type_num` (1..3), `product_family_num` (1..5)
- Telemetry: `machine_capacity_utilization`, `machine_downtime_hours`, `maintenance_overdue_days`, `material_availability_pct`, `supplier_delay_days`, `workforce_availability_pct`, `workforce_skill_index`, `active_workload_orders`

## 2. Classification Architecture Comparison
- **Logistic Regression**: Linear baseline ($L_2$ regularization)
- **Decision Tree**: Max depth 6
- **Random Forest Classifier**: 100 estimators, max depth 8
- **XGBoost Classifier**: 100 estimators, learning rate 0.08, max depth 5

## 3. Regression Architecture Comparison
- **Linear Regression**: Ordinary least squares baseline
- **Random Forest Regressor**: 100 estimators
- **Gradient Boosting Regressor**: 100 estimators, learning rate 0.08
- **XGBoost Regressor**: 100 estimators, learning rate 0.08

## 4. SHAP Feature Attribution
Uses `shap.TreeExplainer` on the trained XGBoost model to calculate positive contribution values per feature and normalize into percentage share of risk.
