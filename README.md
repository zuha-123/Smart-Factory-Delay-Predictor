# AI-Based Production Delay Prediction with Root-Cause Diagnosis and Adaptive Preventive Action Recommendation

[![Python 3.14](https://img.shields.io/badge/Python-3.14-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://reactjs.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-3.4-orange.svg)](https://xgboost.ai)
[![SHAP](https://img.shields.io/badge/SHAP-Explainable_AI-purple.svg)](https://shap.readthedocs.io)

A complete, production-grade, software-only end-to-end platform built for Final Year B.Tech Computer Science and Engineering. The system predicts production delays, computes expected delay durations, provides explainable SHAP root-cause attributions, calculates dynamic risk scores, and recommends ranked counterfactual preventive actions.

---

## 🌟 Key Features
- **Binary Delay Classification**: Predicts `ON-TIME` vs `DELAYED` (Evaluates Logistic Regression, Decision Tree, Random Forest, **XGBoost - 0.9213 F1**).
- **Delay Duration Regression**: Predicts expected delay in days (Evaluates Linear Regression, Random Forest, **Gradient Boosting - 0.6485 R²**).
- **SHAP Root-Cause Explainer**: Extracts top primary and secondary operational causes with exact percentage contribution and grounded natural language explanations.
- **Dynamic Risk Score Engine**: Multi-factor 0–100 score categorized into `LOW` (0-25), `MEDIUM` (26-50), `HIGH` (51-75), and `CRITICAL` (76-100).
- **Adaptive Preventive Action Engine**: Evaluates counterfactual intervention scenarios (Maintenance, Material Reallocation, Staff Overtime, Workload Rebalancing) and ranks candidate actions by expected improvement days.
- **17 Industrial Dashboard Views**: React 19 + Vite + Tailwind CSS + Recharts UI.
- **Dataset Upload & Validation**: CSV/Excel upload validator for missing values and schema errors.
- **Research & Patent Docs**: 24-section `RESEARCH_PAPER.md` and `PATENT_NOVELTY_NOTES.md`.

---

## 💻 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Recharts, Lucide Icons, Axios.
- **Backend**: Python 3.14, FastAPI, Uvicorn, SQLAlchemy, PyJWT, Pydantic v2.
- **ML Engine**: Scikit-Learn, XGBoost, SHAP, Pandas, NumPy.
- **Database**: SQLite (`production_delay.db`).

---

## 🚀 Quick Start Instructions

```bash
# 1. Train ML Models
$env:PYTHONPATH="."
python -m ml.train_models

# 2. Seed Demo Database
python scripts/seed_demo.py

# 3. Start Backend Server (Port 8000)
python -m uvicorn backend.app.main:app --reload --port 8000

# 4. Start React Frontend (Port 3000)
cd frontend
npm install
npm run dev
```

### Default Credentials
- **Admin**: `admin@factory.com` / `admin123`
- **Production Manager**: `manager@factory.com` / `manager123`
- **Analyst**: `analyst@factory.com` / `analyst123`

---

## 📁 Repository Structure
```text
production-delay-ai/
├── backend/            # FastAPI app, API routers, ORM models, schemas, risk/recommendation engines
├── ml/                 # Data generator, preprocessor, trainer, SHAP explainer, saved models
├── frontend/           # Vite + React 19 industrial dashboard (17 views)
├── docs/               # Research paper, Patent notes, Architecture, Schema, ML Pipeline docs
├── scripts/            # Demo DB seeder & setup scripts
└── tests/              # Pytest automated API & ML test suites
```
