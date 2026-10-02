from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any, Dict
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_email: str
    full_name: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# User Schemas
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role_id: int

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role_id: int
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

# Production Order Schemas
class ProductionOrderCreate(BaseModel):
    order_id: str
    product_family: str
    order_quantity: int
    planned_duration_days: float
    order_priority: str = "Medium"
    shift_type: str = "Day"
    machine_capacity_utilization: float = 80.0
    machine_downtime_hours: float = 0.0
    maintenance_overdue_days: int = 0
    material_availability_pct: float = 90.0
    supplier_delay_days: float = 0.0
    workforce_availability_pct: float = 90.0
    workforce_skill_index: float = 0.85
    active_workload_orders: int = 5

class ProductionOrderOut(ProductionOrderCreate):
    id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# Machine Schemas
class MachineCreate(BaseModel):
    machine_code: str
    name: str
    category: str
    capacity_utilization: float = 75.0
    downtime_hours: float = 0.0
    maintenance_overdue_days: int = 0
    status: str = "Operational"

class MachineOut(MachineCreate):
    id: int
    last_serviced_date: datetime
    class Config:
        from_attributes = True

# Material Schemas
class MaterialCreate(BaseModel):
    material_code: str
    name: str
    stock_quantity: float
    unit: str = "Units"
    availability_pct: float = 95.0
    supplier_delay_days: float = 0.0
    reorder_level: float = 200.0

class MaterialOut(MaterialCreate):
    id: int
    class Config:
        from_attributes = True

# Workforce Schemas
class WorkforceCreate(BaseModel):
    operator_code: str
    full_name: str
    shift_type: str = "Day"
    availability_pct: float = 90.0
    skill_index: float = 0.85

class WorkforceOut(WorkforceCreate):
    id: int
    class Config:
        from_attributes = True

# Prediction & Diagnostics Schemas
class CauseItem(BaseModel):
    feature: str
    label: str
    value: float
    shap_value: float
    contribution_pct: float
    category_desc: str

class RootCauseOut(BaseModel):
    delay_probability: float
    primary_cause: Optional[CauseItem] = None
    secondary_causes: List[CauseItem] = []
    all_causes: List[CauseItem] = []
    human_explanation: str

class RiskScoreOut(BaseModel):
    risk_score: float
    risk_category: str
    components: Dict[str, float]

class RecommendationItem(BaseModel):
    action_id: str
    action_name: str
    category: str
    expected_delay_days: float
    improvement_days: float
    feasibility: str
    cost_level: str
    description: str
    is_recommended: bool

class RecommendationOut(BaseModel):
    baseline_expected_delay_days: float
    recommended_action: RecommendationItem
    recommendation_reason: str
    ranked_candidate_actions: List[RecommendationItem]

class OrderPredictionFullOut(BaseModel):
    order_id: str
    delay_probability: float
    is_delayed_predicted: bool
    expected_delay_days: float
    risk: RiskScoreOut
    root_cause: RootCauseOut
    recommendations: RecommendationOut

class CustomPredictRequest(ProductionOrderCreate):
    pass
