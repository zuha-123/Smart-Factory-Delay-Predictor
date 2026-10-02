# REST API Reference Documentation

## Authentication Endpoints
- `POST /auth/login` - Authenticate user & receive JWT token
- `POST /auth/register` - Create user account
- `GET /auth/me` - Get current user profile

## Production Orders Endpoints
- `GET /orders` - List all production orders
- `POST /orders` - Create new production order
- `GET /orders/{id}` - Get order by ID
- `PUT /orders/{id}` - Update order
- `DELETE /orders/{id}` - Delete order

## AI Prediction & Diagnosis Endpoints
- `POST /prediction/{order_id}` - Execute full ML prediction, SHAP diagnosis, risk scoring, and counterfactual action recommendations
- `GET /prediction/{order_id}` - Fetch existing prediction breakdown
- `POST /prediction/simulate` - Simulate prediction on custom input parameters
- `GET /risk/{order_id}` - Get risk score details
- `GET /root-cause/{order_id}` - Get SHAP root-cause breakdown
- `GET /recommendations/{order_id}` - Get preventive action recommendations

## Resources & Administration
- `GET /machines`, `POST /machines`
- `GET /materials`, `POST /materials`
- `GET /workforce`, `POST /workforce`
- `POST /dataset/upload` - CSV/Excel dataset upload validation
- `GET /model-performance` - ML metric comparison tables
- `POST /model-performance/retrain` - Trigger pipeline retraining
