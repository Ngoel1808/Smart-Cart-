from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.models.user import User
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.services.product_service import product_service
from app.core.dependencies import require_manager_or_staff

router = APIRouter()

@router.get("", response_model=List[ProductResponse])
def get_products(
    skip: int = 0, limit: int = 100,
    search: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve products with optional filtering. Open to all (Customer/Staff/Manager).
    """
    return product_service.get_products(db, skip, limit, search, category, brand, is_active)

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Get a specific product.
    """
    product = product_service.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("", response_model=ProductResponse)
def create_product(
    product_in: ProductCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_staff)
):
    """
    Create a new product. Manager or Staff only.
    """
    if product_in.selling_price > product_in.mrp:
        raise HTTPException(status_code=400, detail="Selling price cannot exceed MRP")
    if product_in.selling_price < 0 or product_in.stock < 0:
        raise HTTPException(status_code=400, detail="Price and stock cannot be negative")
        
    return product_service.create_product(db, product_in)

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int, 
    product_in: ProductUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_staff)
):
    """
    Update an existing product. Manager or Staff only.
    """
    if product_in.selling_price is not None and product_in.mrp is not None:
        if product_in.selling_price > product_in.mrp:
            raise HTTPException(status_code=400, detail="Selling price cannot exceed MRP")
            
    product = product_service.update_product(db, product_id, product_in)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
