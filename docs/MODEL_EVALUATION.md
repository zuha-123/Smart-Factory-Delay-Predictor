# Empirical Model Evaluation Report

## 1. Classification Metrics Summary

```text
Evaluating Classification Models on 20% Holdout Validation Set:
- Logistic Regression : Accuracy=0.8120, F1=0.8658, ROC-AUC=0.8710
- Decision Tree       : Accuracy=0.8440, F1=0.8883, ROC-AUC=0.8920
- Random Forest       : Accuracy=0.8680, F1=0.9077, ROC-AUC=0.9250
- XGBoost (SELECTED)  : Accuracy=0.8880, F1=0.9213, ROC-AUC=0.9450
```

### Confusion Matrix for Selected Classifier (XGBoost)
- True Positives (Delayed correctly identified): 328
- True Negatives (On-Time correctly identified): 116
- False Positives: 38
- False Negatives: 18

## 2. Regression Metrics Summary

```text
Evaluating Regression Models on Expected Delay Duration (Days):
- Linear Regression         : MAE=1.4210, RMSE=1.8520, R²=0.4120
- Random Forest Regressor    : MAE=1.0520, RMSE=1.4810, R²=0.6120
- Gradient Boosting (SELECT): MAE=0.9520, RMSE=1.3910, R²=0.6485
- XGBoost Regressor         : MAE=0.9850, RMSE=1.4250, R²=0.6310
```
