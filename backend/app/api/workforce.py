from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app.core.database import get_db
from backend.app.models.db_models import Workforce
from backend.app.schemas.api_schemas import WorkforceCreate, WorkforceOut
from backend.app.api.auth import get_current_user, require_role

router = APIRouter(prefix="/workforce", tags=["Workforce"])

@router.get("", response_model=List[WorkforceOut])
def list_workforce(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Workforce).all()

@router.post("", response_model=WorkforceOut, status_code=status.HTTP_201_CREATED)
def create_workforce(
    wf_in: WorkforceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["Admin", "Production Manager"]))
):
    existing = db.query(Workforce).filter(Workforce.operator_code == wf_in.operator_code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Operator code '{wf_in.operator_code}' already exists.")
        
    wf = Workforce(**wf_in.dict())
    db.add(wf)
    db.commit()
    db.refresh(wf)
    return wf
