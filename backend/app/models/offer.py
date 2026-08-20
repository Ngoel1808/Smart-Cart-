from sqlalchemy import Column, Integer, Float, Enum, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.database.base import Base
import enum

class OfferType(str, enum.Enum):
    PERCENTAGE = "PERCENTAGE"
    FLAT = "FLAT"
    BOGO = "BOGO"
    BUY_X_GET_Y = "BUY_X_GET_Y"

class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    offer_type = Column(Enum(OfferType), nullable=False)
    
    discount_percentage = Column(Float, nullable=True)
    discount_amount = Column(Float, nullable=True)
    buy_quantity = Column(Integer, nullable=True)
    free_quantity = Column(Integer, nullable=True)
    
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
