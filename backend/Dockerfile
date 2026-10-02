FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend, ml, and scripts
COPY backend/ /app/backend/
COPY ml/ /app/ml/
COPY scripts/ /app/scripts/

ENV PYTHONPATH=/app

# Train models and seed demo database during build/startup
RUN python -m ml.train_models && python scripts/seed_demo.py

EXPOSE 8000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
