import random
from typing import List, Dict, Any
from abc import ABC, abstractmethod
from sqlalchemy.orm import Session
from fastapi import UploadFile

from app.models.product import Product
from app.models.offer import Offer
from app.services.discount_service import discount_service

class AIService(ABC):
    @abstractmethod
    def recognize_objects(self, db: Session, image: UploadFile) -> Dict[str, Any]:
        pass

class MockAIService(AIService):
    def recognize_objects(self, db: Session, image: UploadFile) -> Dict[str, Any]:
        """
        Mock implementation that simulates YOLO object detection.
        It pretends to find a few objects from the database with random confidences.
        """
        # We simulate returning some known ai_classes if they exist in the DB
        possible_classes = ["oreo", "lays", "coke", "pepsi", "maggi", "kurkure"]
        
        # Pick 1 to 3 random classes
        detected_classes = random.sample(possible_classes, random.randint(1, 3))
        
        detections = []
        for ai_class in detected_classes:
            product = db.query(Product).filter(Product.ai_class == ai_class, Product.is_active == True).first()
            if product:
                # Find active offer
                offer = db.query(Offer).filter(Offer.product_id == product.id, Offer.is_active == True).first()
                
                # Use discount service to get price (assuming quantity 1)
                calc = discount_service.calculate_discount(product.selling_price, 1, offer)
                
                detections.append({
                    "ai_class": ai_class,
                    "product_id": product.id,
                    "product_name": product.name,
                    "confidence": round(random.uniform(0.75, 0.99), 3),
                    "price": product.selling_price,
                    "active_offer": calc["offer_applied"],
                    "discounted_price": calc["final_price"]
                })
                
        return {"detections": detections}

# Dependency injection instance
ai_service = MockAIService()
