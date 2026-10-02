# Automated & Manual Testing Documentation

## Automated Test Execution
Automated unit and integration tests cover REST API routes, JWT authentication, order CRUD, dataset generation, ML pipeline inference, SHAP root cause outputs, dynamic risk scoring, and counterfactual action recommendations.

To run automated tests:
```bash
$env:PYTHONPATH="."
python -m pytest backend/tests
```

## Test Coverage Summary
- `backend/tests/test_api.py`: Root endpoint, Admin/Manager authentication, JWT verification, order listing, AI prediction flow.
- `backend/tests/test_ml_and_engine.py`: Synthetic dataset generator schema, dynamic risk calculator score bounds, SHAP explainer causes, candidate action ranking.
