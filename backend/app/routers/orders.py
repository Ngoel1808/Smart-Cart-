from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.user import User
from app.models.order import Order, OrderItem
from app.schemas.order import OrderResponse
from app.services.order_service import order_service
from app.core.dependencies import require_customer, require_manager_or_staff

router = APIRouter()

@router.post("/checkout", response_model=OrderResponse)
def checkout(db: Session = Depends(get_db), current_user: User = Depends(require_customer)):
    """
    Checkout current active cart to create an order. Customer only.
    """
    return order_service.checkout(db, current_user.id)

@router.get("/my-orders", response_model=List[OrderResponse])
def get_my_orders(db: Session = Depends(get_db), current_user: User = Depends(require_customer)):
    """
    Get customer's orders.
    """
    orders = db.query(Order).filter(Order.customer_id == current_user.id).all()
    # Need to load items explicitly for Pydantic if not using lazy='joined'
    for order in orders:
        order.items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    return orders

@router.get("", response_model=List[OrderResponse])
def get_all_orders(db: Session = Depends(get_db), current_user: User = Depends(require_manager_or_staff)):
    """
    Get all orders. Manager/Staff only.
    """
    orders = db.query(Order).all()
    for order in orders:
        order.items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_manager_or_staff)):
    """
    Get specific order details by staff/manager.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    return order
