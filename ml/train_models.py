import os
import json
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingRegressor
from xgboost import XGBClassifier, XGBRegressor
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix,
    mean_absolute_error, root_mean_squared_error, r2_score
)

from ml.preprocessing import preprocess_dataframe, save_preprocessor, FEATURE_COLUMNS

def train_and_evaluate_all():
    data_path = os.path.join(os.path.dirname(__file__), "data", "production_delay_dataset.csv")
    models_dir = os.path.join(os.path.dirname(__file__), "saved_models")
    os.makedirs(models_dir, exist_ok=True)
    
    if not os.path.exists(data_path):
        from ml.generate_dataset import generate_production_dataset
        df = generate_production_dataset(2500, seed=42)
        os.makedirs(os.path.dirname(data_path), exist_ok=True)
        df.to_csv(data_path, index=False)
    else:
        df = pd.read_csv(data_path)
        
    X, df_processed = preprocess_dataframe(df)
    y_cls = df_processed["is_delayed"].values
    y_reg = df_processed["delay_days"].values
    
    X_train, X_test, y_cls_train, y_cls_test, y_reg_train, y_reg_test = train_test_split(
        X, y_cls, y_reg, test_size=0.20, random_state=42, stratify=y_cls
    )
    
    save_preprocessor(models_dir)
    
    # ----------------------------------------------------
    # 1. CLASSIFICATION MODELS
    # ----------------------------------------------------
    cls_models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(max_depth=6, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42),
        "XGBoost": XGBClassifier(n_estimators=100, max_depth=5, learning_rate=0.08, random_state=42, eval_metric="logloss")
    }
    
    cls_results = {}
    best_cls_name = None
    best_cls_f1 = -1.0
    best_cls_model = None
    
    for name, model in cls_models.items():
        model.fit(X_train, y_cls_train)
        preds = model.predict(X_test)
        probs = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else preds
        
        acc = float(accuracy_score(y_cls_test, preds))
        prec = float(precision_score(y_cls_test, preds, zero_division=0))
        rec = float(recall_score(y_cls_test, preds, zero_division=0))
        f1 = float(f1_score(y_cls_test, preds, zero_division=0))
        auc = float(roc_auc_score(y_cls_test, probs))
        cm = confusion_matrix(y_cls_test, preds).tolist()
        
        cls_results[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(auc, 4),
            "confusion_matrix": cm
        }
        
        if f1 > best_cls_f1:
            best_cls_f1 = f1
            best_cls_name = name
            best_cls_model = model
            
    joblib.dump(best_cls_model, os.path.join(models_dir, "best_classifier.joblib"))
    
    # Feature importances for best classifier
    feature_importances = {}
    if hasattr(best_cls_model, "feature_importances_"):
        imps = best_cls_model.feature_importances_
        feature_importances = {col: round(float(imp), 4) for col, imp in zip(FEATURE_COLUMNS, imps)}
    elif hasattr(best_cls_model, "coef_"):
        coefs = np.abs(best_cls_model.coef_[0])
        feature_importances = {col: round(float(c), 4) for col, c in zip(FEATURE_COLUMNS, coefs)}
        
    # ----------------------------------------------------
    # 2. REGRESSION MODELS
    # ----------------------------------------------------
    reg_models = {
        "Linear Regression": LinearRegression(),
        "Random Forest Regressor": RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, max_depth=5, learning_rate=0.08, random_state=42),
        "XGBoost Regressor": XGBRegressor(n_estimators=100, max_depth=5, learning_rate=0.08, random_state=42)
    }
    
    reg_results = {}
    best_reg_name = None
    best_reg_r2 = -999.0
    best_reg_model = None
    
    for name, model in reg_models.items():
        model.fit(X_train, y_reg_train)
        preds = model.predict(X_test)
        
        mae = float(mean_absolute_error(y_reg_test, preds))
        rmse = float(root_mean_squared_error(y_reg_test, preds))
        r2 = float(r2_score(y_reg_test, preds))
        
        reg_results[name] = {
            "mae": round(mae, 4),
            "rmse": round(rmse, 4),
            "r2_score": round(r2, 4)
        }
        
        if r2 > best_reg_r2:
            best_reg_r2 = r2
            best_reg_name = name
            best_reg_model = model
            
    joblib.dump(best_reg_model, os.path.join(models_dir, "best_regressor.joblib"))
    
    summary = {
        "best_classifier": best_cls_name,
        "best_regressor": best_reg_name,
        "classification_metrics": cls_results,
        "regression_metrics": reg_results,
        "feature_importances": feature_importances,
        "feature_columns": FEATURE_COLUMNS
    }
    
    with open(os.path.join(models_dir, "metrics_summary.json"), "w") as f:
        json.dump(summary, f, indent=2)
        
    print(f"ML Pipeline Training Complete.")
    print(f"Best Classifier: {best_cls_name} (F1: {best_cls_f1:.4f})")
    print(f"Best Regressor: {best_reg_name} (R2: {best_reg_r2:.4f})")
    return summary

if __name__ == "__main__":
    train_and_evaluate_all()
