# Local Setup & Step-by-Step Execution Guide

## Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js v18+ & npm (Tested on Node v24.12)
- Git

## Step 1: Install Python Dependencies
```bash
cd backend
pip install fastapi uvicorn xgboost shap sqlalchemy pyjwt passlib bcrypt pytest openpyxl python-multipart matplotlib seaborn httpx
```

## Step 2: Generate Dataset & Train ML Models
```bash
# Run from repository root
$env:PYTHONPATH="."
python -m ml.train_models
```

## Step 3: Seed Demo Database
```bash
python scripts/seed_demo.py
```

## Step 4: Start Backend FastAPI Server
```bash
python -m uvicorn backend.app.main:app --reload --port 8000
```
API Documentation will be available at `http://127.0.0.1:8000/docs`.

## Step 5: Start React Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` (or `http://localhost:5173`) in your browser.

## Step 6: Sign In
- **Admin**: `admin@factory.com` / `admin123`
- **Production Manager**: `manager@factory.com` / `manager123`
- **Analyst**: `analyst@factory.com` / `analyst123`
