from sqlalchemy import Column, Integer, Float, Enum, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database.base import Base
import enum

class CartStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    CHECKED_OUT = "CHECKED_OUT"
    ABANDONED = "ABANDONED"

class Cart(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(Enum(CartStatus), nullable=False, default=CartStatus.ACTIVE)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Float, nullable=False)
    discount_amount = Column(Float, nullable=False, default=0.0)
    final_price = Column(Float, nullable=False)
