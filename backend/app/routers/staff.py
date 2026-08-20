from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.core.dependencies import require_staff

router = APIRouter()

@router.get("/dashboard")
def get_staff_dashboard(db: Session = Depends(get_db), current_user: User = Depends(require_staff)):
    return {"message": "Staff dashboard data"}
