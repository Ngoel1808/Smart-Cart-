from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    brand: Optional[str] = None
    category: str
    description: Optional[str] = None
    mrp: float
    selling_price: float
    stock: int = 0
    barcode: Optional[str] = None
    ai_class: Optional[str] = None
    is_active: bool = True
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    mrp: Optional[float] = None
    selling_price: Optional[float] = None
    stock: Optional[int] = None
    barcode: Optional[str] = None
    ai_class: Optional[str] = None
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
