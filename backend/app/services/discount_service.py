import math
from typing import Optional, Dict, Any
from app.models.offer import Offer, OfferType

class DiscountService:
    @staticmethod
    def calculate_discount(product_price: float, quantity: int, offer: Optional[Offer]) -> Dict[str, Any]:
        """
        Calculates the discount based on the active offer and quantity.
        Returns a dict containing subtotal, discount, final_price, and offer_applied message.
        """
        subtotal = product_price * quantity
        discount = 0.0
        offer_msg = None
        
        if not offer or not offer.is_active:
            return {
                "subtotal": subtotal,
                "discount": discount,
                "final_price": subtotal,
                "offer_applied": offer_msg
            }
            
        if offer.offer_type == OfferType.PERCENTAGE and offer.discount_percentage:
            discount = subtotal * (offer.discount_percentage / 100.0)
            offer_msg = f"{offer.discount_percentage}% OFF"
            
        elif offer.offer_type == OfferType.FLAT and offer.discount_amount:
            # Usually flat discount is applied per item, or once per order. Assuming per item here based on standard retail.
            discount = offer.discount_amount * quantity
            offer_msg = f"FLAT ₹{offer.discount_amount} OFF"
            
        elif offer.offer_type == OfferType.BOGO:
            buy_q = offer.buy_quantity or 1
            free_q = offer.free_quantity or 1
            set_size = buy_q + free_q
            # Number of full sets the customer gets
            sets = quantity // set_size
            # The discount applies to the 'free' items in each set
            discount = sets * free_q * product_price
            offer_msg = f"BUY {buy_q} GET {free_q} FREE"
            
        elif offer.offer_type == OfferType.BUY_X_GET_Y:
            buy_q = offer.buy_quantity or 2
            free_q = offer.free_quantity or 1
            set_size = buy_q + free_q
            sets = quantity // set_size
            discount = sets * free_q * product_price
            offer_msg = f"BUY {buy_q} GET {free_q} FREE"
            
        # Ensure discount doesn't exceed subtotal (sanity check)
        discount = min(discount, subtotal)
        final_price = subtotal - discount
        
        return {
            "subtotal": subtotal,
            "discount": discount,
            "final_price": final_price,
            "offer_applied": offer_msg if discount > 0 else None
        }

discount_service = DiscountService()
