from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime
from app.models.offer import OfferType

class OfferBase(BaseModel):
    product_id: int
    offer_type: OfferType
    discount_percentage: Optional[float] = None
    discount_amount: Optional[float] = None
    buy_quantity: Optional[int] = None
    free_quantity: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: bool = True

class OfferCreate(OfferBase):
    pass

class OfferUpdate(BaseModel):
    offer_type: Optional[OfferType] = None
    discount_percentage: Optional[float] = None
    discount_amount: Optional[float] = None
    buy_quantity: Optional[int] = None
    free_quantity: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None

class OfferResponse(OfferBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
