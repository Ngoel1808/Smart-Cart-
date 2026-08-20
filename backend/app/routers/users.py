from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.core.dependencies import require_manager

router = APIRouter()

@router.get("", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_manager)
):
    """
    Retrieve all users. Manager only.
    """
    users = db.query(User).offset(skip).limit(limit).all()
    return users
