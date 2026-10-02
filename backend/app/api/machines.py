from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app.core.database import get_db
from backend.app.models.db_models import Machine, AuditLog
from backend.app.schemas.api_schemas import MachineCreate, MachineOut
from backend.app.api.auth import get_current_user, require_role

router = APIRouter(prefix="/machines", tags=["Machines"])

@router.get("", response_model=List[MachineOut])
def list_machines(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Machine).all()

@router.post("", response_model=MachineOut, status_code=status.HTTP_201_CREATED)
def create_machine(
    machine_in: MachineCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["Admin", "Production Manager"]))
):
    existing = db.query(Machine).filter(Machine.machine_code == machine_in.machine_code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Machine code '{machine_in.machine_code}' already exists.")
        
    machine = Machine(**machine_in.dict())
    db.add(machine)
    db.commit()
    db.refresh(machine)
    return machine

@router.put("/{id}", response_model=MachineOut)
def update_machine(
    id: int,
    machine_in: MachineCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["Admin", "Production Manager"]))
):
    machine = db.query(Machine).filter(Machine.id == id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
        
    for k, v in machine_in.dict().items():
        setattr(machine, k, v)
        
    db.commit()
    db.refresh(machine)
    return machine

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_machine(id: int, db: Session = Depends(get_db), current_user = Depends(require_role(["Admin"]))):
    machine = db.query(Machine).filter(Machine.id == id).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    db.delete(machine)
    db.commit()
    return None
