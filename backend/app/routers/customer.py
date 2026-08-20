from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.core.dependencies import require_customer

router = APIRouter()

@router.get("/dashboard")
def get_customer_dashboard(db: Session = Depends(get_db), current_user: User = Depends(require_customer)):
    return {"message": "Customer dashboard data"}
