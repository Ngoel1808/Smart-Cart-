from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.user import User, Role
from app.models.order import Order, OrderItem, PaymentStatus
from app.models.product import Product
from app.schemas.analytics import DashboardStats
from app.core.dependencies import require_manager

router = APIRouter()

@router.get("/dashboard", response_model=DashboardStats)
def get_analytics_dashboard(db: Session = Depends(get_db), current_user: User = Depends(require_manager)):
    """
    Get core metrics for the manager dashboard.
    """
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0.0
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_customers = db.query(func.count(User.id)).filter(User.role == Role.CUSTOMER).scalar() or 0
    low_stock = db.query(func.count(Product.id)).filter(Product.stock < 10).scalar() or 0
    
    return DashboardStats(
        total_revenue=float(total_revenue),
        total_orders=total_orders,
        total_products=total_products,
        total_customers=total_customers,
        low_stock_products=low_stock
    )
