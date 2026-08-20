from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItemResponse(CartItemBase):
    id: int
    product_name: str
    unit_price: float
    subtotal: float
    discount: float
    final_price: float
    offer: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class CartResponse(BaseModel):
    items: List[CartItemResponse]
    subtotal: float
    discount: float
    total: float
    amount_saved: float
    status: str
