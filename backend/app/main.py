import sys
import os
# Ensure root directory is on python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.core.database import Base, engine, SessionLocal
from backend.app.models.db_models import Role, User, AuditLog
from backend.app.core.security import hash_password
from backend.app.core.config import (
    DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASS,
    DEFAULT_MANAGER_EMAIL, DEFAULT_MANAGER_PASS,
    DEFAULT_ANALYST_EMAIL, DEFAULT_ANALYST_PASS
)

from backend.app.api import (
    auth, orders, machines, materials, workforce, datasets, predictions, models_mgmt, users
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Production Delay AI & Root Cause Diagnosis API",
    description="AI-Based Production Delay Prediction with Root-Cause Diagnosis and Adaptive Preventive Action Recommendation",
    version="1.0.0"
)

# CORS Configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db_seed():
    db = SessionLocal()
    try:
        # Seed Roles
        admin_role = db.query(Role).filter(Role.name == "Admin").first()
        if not admin_role:
            admin_role = Role(name="Admin", description="System Administrator")
            db.add(admin_role)
        manager_role = db.query(Role).filter(Role.name == "Production Manager").first()
        if not manager_role:
            manager_role = Role(name="Production Manager", description="Production Manager")
            db.add(manager_role)
        analyst_role = db.query(Role).filter(Role.name == "Analyst").first()
        if not analyst_role:
            analyst_role = Role(name="Analyst", description="Data & ML Analyst")
            db.add(analyst_role)
        db.commit()

        # Seed Default Accounts
        if not db.query(User).filter(User.email == DEFAULT_ADMIN_EMAIL).first():
            admin_user = User(
                email=DEFAULT_ADMIN_EMAIL,
                hashed_password=hash_password(DEFAULT_ADMIN_PASS),
                full_name="System Admin",
                role_id=admin_role.id
            )
            db.add(admin_user)

        if not db.query(User).filter(User.email == DEFAULT_MANAGER_EMAIL).first():
            mgr_user = User(
                email=DEFAULT_MANAGER_EMAIL,
                hashed_password=hash_password(DEFAULT_MANAGER_PASS),
                full_name="Chief Production Manager",
                role_id=manager_role.id
            )
            db.add(mgr_user)

        if not db.query(User).filter(User.email == DEFAULT_ANALYST_EMAIL).first():
            analyst_user = User(
                email=DEFAULT_ANALYST_EMAIL,
                hashed_password=hash_password(DEFAULT_ANALYST_PASS),
                full_name="Lead Data Analyst",
                role_id=analyst_role.id
            )
            db.add(analyst_user)

        db.commit()
    finally:
        db.close()

# Include Routers
app.include_router(auth.router)
app.include_router(orders.router)
app.include_router(machines.router)
app.include_router(materials.router)
app.include_router(workforce.router)
app.include_router(datasets.router)
app.include_router(predictions.router)
app.include_router(models_mgmt.router)
app.include_router(users.router)

@app.get("/")
def root_endpoint():
    return {
        "status": "online",
        "app_name": "Production Delay AI",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.exception_handler(Exception)
def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "details": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
