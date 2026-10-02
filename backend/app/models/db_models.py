from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)  # Admin, Production Manager, Analyst
    description = Column(String, nullable=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    role = relationship("Role")

class Machine(Base):
    __tablename__ = "machines"
    id = Column(Integer, primary_key=True, index=True)
    machine_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    capacity_utilization = Column(Float, default=75.0)
    downtime_hours = Column(Float, default=0.0)
    maintenance_overdue_days = Column(Integer, default=0)
    status = Column(String, default="Operational")  # Operational, Maintenance Required, Offline
    last_serviced_date = Column(DateTime, default=datetime.utcnow)

class Material(Base):
    __tablename__ = "materials"
    id = Column(Integer, primary_key=True, index=True)
    material_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    stock_quantity = Column(Float, default=1000.0)
    unit = Column(String, default="Units")
    availability_pct = Column(Float, default=95.0)
    supplier_delay_days = Column(Float, default=0.0)
    reorder_level = Column(Float, default=200.0)

class Workforce(Base):
    __tablename__ = "workforce"
    id = Column(Integer, primary_key=True, index=True)
    operator_code = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    shift_type = Column(String, default="Day")
    availability_pct = Column(Float, default=90.0)
    skill_index = Column(Float, default=0.85)
    assigned_machine_id = Column(Integer, ForeignKey("machines.id"), nullable=True)

class ProductionOrder(Base):
    __tablename__ = "production_orders"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, unique=True, index=True, nullable=False)
    product_family = Column(String, nullable=False)
    order_quantity = Column(Integer, nullable=False)
    planned_duration_days = Column(Float, nullable=False)
    order_priority = Column(String, default="Medium")
    shift_type = Column(String, default="Day")
    
    machine_id = Column(Integer, ForeignKey("machines.id"), nullable=True)
    machine_capacity_utilization = Column(Float, default=80.0)
    machine_downtime_hours = Column(Float, default=0.0)
    maintenance_overdue_days = Column(Integer, default=0)
    
    material_availability_pct = Column(Float, default=90.0)
    supplier_delay_days = Column(Float, default=0.0)
    
    workforce_availability_pct = Column(Float, default=90.0)
    workforce_skill_index = Column(Float, default=0.85)
    active_workload_orders = Column(Integer, default=5)
    
    status = Column(String, default="Scheduled")  # Scheduled, In Progress, Completed, Delayed
    created_at = Column(DateTime, default=datetime.utcnow)
    
    predictions = relationship("Prediction", back_populates="order", cascade="all, delete-orphan")

class ProductionHistory(Base):
    __tablename__ = "production_history"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, nullable=False)
    product_family = Column(String, nullable=False)
    actual_duration_days = Column(Float, nullable=False)
    delay_occurred = Column(Boolean, default=False)
    delay_duration_days = Column(Float, default=0.0)
    completed_at = Column(DateTime, default=datetime.utcnow)

class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"
    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), nullable=False)
    maintenance_type = Column(String, nullable=False)  # Preventive, Corrective, Overhaul
    notes = Column(Text, nullable=True)
    performed_at = Column(DateTime, default=datetime.utcnow)

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    order_db_id = Column(Integer, ForeignKey("production_orders.id"), nullable=False)
    delay_probability = Column(Float, nullable=False)
    is_delayed_predicted = Column(Boolean, nullable=False)
    expected_delay_days = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    order = relationship("ProductionOrder", back_populates="predictions")
    risk_score = relationship("RiskScore", uselist=False, back_populates="prediction", cascade="all, delete-orphan")
    root_cause = relationship("RootCause", uselist=False, back_populates="prediction", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="prediction", cascade="all, delete-orphan")

class RiskScore(Base):
    __tablename__ = "risk_scores"
    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=False)
    risk_score = Column(Float, nullable=False)
    risk_category = Column(String, nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    breakdown_json = Column(Text, nullable=True)

    prediction = relationship("Prediction", back_populates="risk_score")

class RootCause(Base):
    __tablename__ = "root_causes"
    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=False)
    primary_cause = Column(String, nullable=False)
    primary_cause_pct = Column(Float, nullable=False)
    secondary_causes_json = Column(Text, nullable=True)
    human_explanation = Column(Text, nullable=False)

    prediction = relationship("Prediction", back_populates="root_cause")

class Action(Base):
    __tablename__ = "actions"
    id = Column(Integer, primary_key=True, index=True)
    action_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Machine, Material, Workforce, Workload
    description = Column(Text, nullable=True)

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=False)
    action_name = Column(String, nullable=False)
    expected_delay_days = Column(Float, nullable=False)
    improvement_days = Column(Float, nullable=False)
    is_recommended = Column(Boolean, default=False)
    reason = Column(Text, nullable=True)

    prediction = relationship("Prediction", back_populates="recommendations")

class ModelVersion(Base):
    __tablename__ = "model_versions"
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    version = Column(String, nullable=False)
    task_type = Column(String, nullable=False)  # classification, regression
    accuracy_or_r2 = Column(Float, nullable=False)
    f1_or_mae = Column(Float, nullable=False)
    trained_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class DatasetUpload(Base):
    __tablename__ = "dataset_uploads"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    row_count = Column(Integer, nullable=False)
    uploaded_by = Column(String, nullable=False)
    status = Column(String, default="Processed")
    uploaded_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=False)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
