from sqlalchemy import Column, Integer, Enum, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database.base import Base
import enum

class ChangeType(str, enum.Enum):
    PURCHASE = "PURCHASE"
    RESTOCK = "RESTOCK"
    MANUAL_UPDATE = "MANUAL_UPDATE"
    SALE = "SALE"
    RETURN = "RETURN"
    ADJUSTMENT = "ADJUSTMENT"

class InventoryLog(Base):
    __tablename__ = "inventory_logs"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    
    previous_stock = Column(Integer, nullable=False)
    quantity_changed = Column(Integer, nullable=False)
    new_stock = Column(Integer, nullable=False)
    
    change_type = Column(Enum(ChangeType), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
