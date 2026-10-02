from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app.core.database import get_db
from backend.app.models.db_models import Material
from backend.app.schemas.api_schemas import MaterialCreate, MaterialOut
from backend.app.api.auth import get_current_user, require_role

router = APIRouter(prefix="/materials", tags=["Materials"])

@router.get("", response_model=List[MaterialOut])
def list_materials(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return db.query(Material).all()

@router.post("", response_model=MaterialOut, status_code=status.HTTP_201_CREATED)
def create_material(
    material_in: MaterialCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["Admin", "Production Manager"]))
):
    existing = db.query(Material).filter(Material.material_code == material_in.material_code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Material code '{material_in.material_code}' already exists.")
        
    material = Material(**material_in.dict())
    db.add(material)
    db.commit()
    db.refresh(material)
    return material
