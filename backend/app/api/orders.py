from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app.core.database import get_db
from backend.app.models.db_models import ProductionOrder, AuditLog
from backend.app.schemas.api_schemas import ProductionOrderCreate, ProductionOrderOut
from backend.app.api.auth import get_current_user, require_role

router = APIRouter(prefix="/orders", tags=["Production Orders"])

@router.get("", response_model=List[ProductionOrderOut])
def list_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(ProductionOrder).offset(skip).limit(limit).all()

@router.post("", response_model=ProductionOrderOut, status_code=status.HTTP_201_CREATED)
def create_order(
    order_in: ProductionOrderCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["Admin", "Production Manager"]))
):
    existing = db.query(ProductionOrder).filter(ProductionOrder.order_id == order_in.order_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Order ID '{order_in.order_id}' already exists.")
        
    order = ProductionOrder(**order_in.dict())
    db.add(order)
    db.commit()
    db.refresh(order)
    
    log = AuditLog(user_email=current_user.email, action="CREATE_ORDER", details=f"Created order {order.order_id}")
    db.add(log)
    db.commit()
    
    return order

@router.get("/{id}", response_model=ProductionOrderOut)
def get_order(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    order = db.query(ProductionOrder).filter(ProductionOrder.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Production order not found")
    return order

@router.put("/{id}", response_model=ProductionOrderOut)
def update_order(
    id: int,
    order_in: ProductionOrderCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["Admin", "Production Manager"]))
):
    order = db.query(ProductionOrder).filter(ProductionOrder.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Production order not found")
        
    for key, value in order_in.dict().items():
        setattr(order, key, value)
        
    db.commit()
    db.refresh(order)
    
    log = AuditLog(user_email=current_user.email, action="UPDATE_ORDER", details=f"Updated order {order.order_id}")
    db.add(log)
    db.commit()
    
    return order

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["Admin"]))
):
    order = db.query(ProductionOrder).filter(ProductionOrder.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Production order not found")
        
    db.delete(order)
    db.commit()
    return None
