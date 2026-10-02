from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.app.core.database import get_db
from backend.app.models.db_models import User, Role
from backend.app.schemas.api_schemas import UserOut, UserCreate
from backend.app.core.security import hash_password
from backend.app.api.auth import get_current_user, require_role

router = APIRouter(prefix="/users", tags=["User Management"])

@router.get("", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), current_user = Depends(require_role(["Admin"]))):
    return db.query(User).all()

@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user_admin(user_in: UserCreate, db: Session = Depends(get_db), current_user = Depends(require_role(["Admin"]))):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
        
    hashed_pwd = hash_password(user_in.password)
    user = User(
        email=user_in.email,
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
        role_id=user_in.role_id
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user = Depends(require_role(["Admin"]))):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.email == current_user.email:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
    db.delete(user)
    db.commit()
    return None
