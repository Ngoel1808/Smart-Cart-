from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.schemas.cart import CartResponse, CartItemCreate
from app.services.cart_service import cart_service
from app.core.dependencies import require_customer

router = APIRouter()

@router.get("", response_model=CartResponse)
def get_cart(db: Session = Depends(get_db), current_user: User = Depends(require_customer)):
    return cart_service.get_cart_response(db, current_user.id)

@router.post("/items", response_model=CartResponse)
def add_item_to_cart(
    item_in: CartItemCreate,
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_customer)
):
    return cart_service.add_item_to_cart(db, current_user.id, item_in)

@router.delete("/items/{item_id}", response_model=CartResponse)
def remove_item_from_cart(
    item_id: int,
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_customer)
):
    return cart_service.remove_item(db, current_user.id, item_id)

@router.delete("/clear", response_model=CartResponse)
def clear_cart(
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_customer)
):
    return cart_service.clear_cart(db, current_user.id)
