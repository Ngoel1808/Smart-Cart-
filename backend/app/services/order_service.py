from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List
import uuid

from app.models.cart import CartStatus
from app.models.order import Order, OrderItem
from app.models.inventory import InventoryLog, ChangeType
from app.models.product import Product
from app.services.cart_service import cart_service

class OrderService:
    @staticmethod
    def checkout(db: Session, customer_id: int) -> Order:
        # 1. Get and calculate cart
        cart_resp = cart_service.get_cart_response(db, customer_id)
        if not cart_resp.items:
            raise HTTPException(status_code=400, detail="Cart is empty")
            
        cart_db = cart_service.get_or_create_cart(db, customer_id)
        
        # 2. Verify stock one more time before creating order
        for item in cart_resp.items:
            product = db.query(Product).with_for_update().filter(Product.id == item.product_id).first()
            if not product or product.stock < item.quantity:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for {item.product_name}")
                
        # 3. Create Order
        order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        order = Order(
            customer_id=customer_id,
            order_number=order_number,
            subtotal=cart_resp.subtotal,
            discount_amount=cart_resp.discount,
            total_amount=cart_resp.total,
            payment_status="PENDING", # Could be changed to PAID based on payment gateway integration
            order_status="PLACED"
        )
        db.add(order)
        db.flush() # Get order ID
        
        # 4. Create Order Items & Deduct Inventory
        for item in cart_resp.items:
            # Order Item
            order_item = OrderItem(
                order_id=order.id,
                product_id=item.product_id,
                product_name=item.product_name,
                quantity=item.quantity,
                unit_price=item.unit_price,
                discount_amount=item.discount,
                final_price=item.final_price
            )
            db.add(order_item)
            
            # Deduct Inventory
            product = db.query(Product).filter(Product.id == item.product_id).first()
            old_stock = product.stock
            product.stock -= item.quantity
            
            # Create Inventory Log
            log = InventoryLog(
                product_id=product.id,
                previous_stock=old_stock,
                quantity_changed=-item.quantity,
                new_stock=product.stock,
                change_type=ChangeType.SALE,
                updated_by=customer_id
            )
            db.add(log)
            
        # 5. Mark Cart as checked out
        cart_db.status = CartStatus.CHECKED_OUT
        db.commit()
        db.refresh(order)
        return order

order_service = OrderService()
