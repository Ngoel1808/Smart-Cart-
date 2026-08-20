from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from app.models.order import PaymentStatus, OrderStatus

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: float
    discount_amount: float
    final_price: float
    
    model_config = ConfigDict(from_attributes=True)

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    order_number: str
    subtotal: float
    discount_amount: float
    total_amount: float
    payment_status: PaymentStatus
    order_status: OrderStatus
    created_at: datetime
    
    items: List[OrderItemResponse] = []
    
    model_config = ConfigDict(from_attributes=True)
