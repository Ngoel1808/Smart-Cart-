from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database.base import Base
import enum

class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"

class OrderStatus(str, enum.Enum):
    PLACED = "PLACED"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    
    subtotal = Column(Float, nullable=False)
    discount_amount = Column(Float, nullable=False, default=0.0)
    total_amount = Column(Float, nullable=False)
    
    payment_status = Column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
    order_status = Column(Enum(OrderStatus), nullable=False, default=OrderStatus.PLACED)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    product_name = Column(String(150), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    discount_amount = Column(Float, nullable=False, default=0.0)
    final_price = Column(Float, nullable=False)
