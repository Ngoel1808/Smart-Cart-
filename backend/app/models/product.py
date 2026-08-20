from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.base import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), index=True, nullable=False)
    brand = Column(String(100), nullable=True)
    category = Column(String(100), index=True, nullable=False)
    description = Column(String(500), nullable=True)
    mrp = Column(Float, nullable=False)
    selling_price = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    image_url = Column(String(255), nullable=True)
    barcode = Column(String(50), unique=True, index=True, nullable=True)
    ai_class = Column(String(100), index=True, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
