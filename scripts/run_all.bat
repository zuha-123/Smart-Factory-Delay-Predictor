@echo off
echo ===================================================================
echo   Starting AI-Based Production Delay Prediction Platform
echo ===================================================================

set PYTHONPATH=.

echo [1/3] Training ML Models and Evaluating Architectures...
python -m ml.train_models

echo [2/3] Seeding SQLite Database with Demo Production Orders...
python scripts/seed_demo.py

echo [3/3] Starting FastAPI Backend Server on http://127.0.0.1:8000 ...
start python -m uvicorn backend.app.main:app --reload --port 8000

echo Starting React Frontend Dashboard on http://localhost:3000 ...
cd frontend
npm run dev

pause
