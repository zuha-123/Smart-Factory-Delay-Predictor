import os

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-production-delay-prediction-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./production_delay.db")

DEFAULT_ADMIN_EMAIL = "admin@factory.com"
DEFAULT_ADMIN_PASS = "admin123"
DEFAULT_MANAGER_EMAIL = "manager@factory.com"
DEFAULT_MANAGER_PASS = "manager123"
DEFAULT_ANALYST_EMAIL = "analyst@factory.com"
DEFAULT_ANALYST_PASS = "analyst123"
