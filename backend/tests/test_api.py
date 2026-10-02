import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.main import app, startup_db_seed

@pytest.fixture(autouse=True)
def init_db():
    startup_db_seed()

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["app_name"] == "Production Delay AI"

def test_login_admin():
    response = client.post("/auth/login", data={"username": "admin@factory.com", "password": "admin123"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "Admin"


def test_login_invalid():
    response = client.post("/auth/login", data={"username": "admin@factory.com", "password": "wrongpassword"})
    assert response.status_code == 400

def test_orders_flow():
    # Login as Admin
    login_res = client.post("/auth/login", data={"username": "admin@factory.com", "password": "admin123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # List orders
    res = client.get("/orders", headers=headers)
    assert res.status_code == 200
    orders = res.json()
    assert len(orders) > 0

def test_prediction_flow():
    login_res = client.post("/auth/login", data={"username": "admin@factory.com", "password": "admin123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Run prediction for ORD-CRIT-901
    res = client.post("/prediction/ORD-CRIT-901", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "delay_probability" in data
    assert "risk" in data
    assert "root_cause" in data
    assert "recommendations" in data
    assert data["risk"]["risk_category"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
