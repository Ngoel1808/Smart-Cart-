from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.user import User, Role
from app.schemas.user import UserResponse, UserCreate
from app.services.auth_service import create_user
from app.core.dependencies import require_manager

router = APIRouter()

@router.get("/staff", response_model=List[UserResponse])
def get_all_staff(db: Session = Depends(get_db), current_user: User = Depends(require_manager)):
    return db.query(User).filter(User.role == Role.STAFF).all()

@router.post("/staff", response_model=UserResponse)
def create_staff_user(user_in: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(require_manager)):
    user_in.role = Role.STAFF
    return create_user(db, user_in)
