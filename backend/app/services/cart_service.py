from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.cart import Cart, CartItem, CartStatus
from app.models.product import Product
from app.models.offer import Offer
from app.schemas.cart import CartItemCreate, CartResponse, CartItemResponse
from app.services.discount_service import discount_service
from app.services.product_service import product_service

class CartService:
    @staticmethod
    def get_or_create_cart(db: Session, customer_id: int) -> Cart:
        cart = db.query(Cart).filter(Cart.customer_id == customer_id, Cart.status == CartStatus.ACTIVE).first()
        if not cart:
            cart = Cart(customer_id=customer_id)
            db.add(cart)
            db.commit()
            db.refresh(cart)
        return cart

    @staticmethod
    def add_item_to_cart(db: Session, customer_id: int, item_in: CartItemCreate) -> CartResponse:
        cart = CartService.get_or_create_cart(db, customer_id)
        product = product_service.get_product(db, item_in.product_id)
        
        if not product or not product.is_active:
            raise HTTPException(status_code=404, detail="Product not found or inactive")
            
        if item_in.quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be greater than 0")
            
        if product.stock < item_in.quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")

        # Check if item already exists in cart, then update quantity instead
        cart_item = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == product.id).first()
        
        if cart_item:
            cart_item.quantity += item_in.quantity
            if product.stock < cart_item.quantity:
                raise HTTPException(status_code=400, detail="Insufficient stock for updated quantity")
        else:
            cart_item = CartItem(
                cart_id=cart.id,
                product_id=product.id,
                quantity=item_in.quantity,
                unit_price=product.selling_price,
                final_price=product.selling_price
            )
            db.add(cart_item)
            
        db.commit()
        return CartService.get_cart_response(db, customer_id)

    @staticmethod
    def get_cart_response(db: Session, customer_id: int) -> CartResponse:
        cart = CartService.get_or_create_cart(db, customer_id)
        cart_items = db.query(CartItem).filter(CartItem.cart_id == cart.id).all()
        
        items_resp = []
        total_subtotal = 0.0
        total_discount = 0.0
        
        for item in cart_items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if not product:
                continue
                
            offer = db.query(Offer).filter(Offer.product_id == product.id, Offer.is_active == True).first()
            
            calc = discount_service.calculate_discount(product.selling_price, item.quantity, offer)
            
            # Update item in db with latest prices just in case
            item.unit_price = product.selling_price
            item.discount_amount = calc["discount"]
            item.final_price = calc["final_price"]
            
            items_resp.append(CartItemResponse(
                id=item.id,
                product_id=product.id,
                product_name=product.name,
                quantity=item.quantity,
                unit_price=product.selling_price,
                subtotal=calc["subtotal"],
                discount=calc["discount"],
                final_price=calc["final_price"],
                offer=calc["offer_applied"]
            ))
            
            total_subtotal += calc["subtotal"]
            total_discount += calc["discount"]
            
        db.commit() # Save any price recalculations
        
        return CartResponse(
            items=items_resp,
            subtotal=total_subtotal,
            discount=total_discount,
            total=total_subtotal - total_discount,
            amount_saved=total_discount,
            status=cart.status.value
        )
        
    @staticmethod
    def remove_item(db: Session, customer_id: int, item_id: int):
        cart = CartService.get_or_create_cart(db, customer_id)
        item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item not found in cart")
        
        db.delete(item)
        db.commit()
        return CartService.get_cart_response(db, customer_id)

    @staticmethod
    def clear_cart(db: Session, customer_id: int):
        cart = CartService.get_or_create_cart(db, customer_id)
        db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
        db.commit()
        return CartService.get_cart_response(db, customer_id)

cart_service = CartService()
