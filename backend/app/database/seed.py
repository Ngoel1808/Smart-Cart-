import sys
import os

# Add root directory to python path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database.database import SessionLocal, engine
from app.models.user import User, Role, UserStatus
from app.models.product import Product
from app.models.offer import Offer, OfferType
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    
    # 1. Seed Users
    print("Seeding users...")
    users = [
        User(name="Manager User", email="manager@smartcart.com", role=Role.MANAGER, password_hash=get_password_hash("manager123")),
        User(name="Staff User", email="staff@smartcart.com", role=Role.STAFF, password_hash=get_password_hash("staff123")),
        User(name="Customer User", email="customer@smartcart.com", role=Role.CUSTOMER, password_hash=get_password_hash("customer123")),
    ]
    for u in users:
        if not db.query(User).filter(User.email == u.email).first():
            db.add(u)
    
    db.commit()

    manager = db.query(User).filter(User.email == "manager@smartcart.com").first()

    # 2. Seed Products
    print("Seeding products...")
    products_data = [
        {"name": "Lays", "brand": "Frito-Lay", "category": "Snacks", "mrp": 20.0, "selling_price": 20.0, "stock": 50, "ai_class": "lays"},
        {"name": "Oreo", "brand": "Cadbury", "category": "Biscuits", "mrp": 40.0, "selling_price": 40.0, "stock": 100, "ai_class": "oreo"},
        {"name": "Coca-Cola", "brand": "Coca-Cola", "category": "Beverages", "mrp": 40.0, "selling_price": 40.0, "stock": 80, "ai_class": "coke"},
        {"name": "Pepsi", "brand": "PepsiCo", "category": "Beverages", "mrp": 38.0, "selling_price": 38.0, "stock": 60, "ai_class": "pepsi"},
        {"name": "Maggi", "brand": "Nestle", "category": "Snacks", "mrp": 14.0, "selling_price": 14.0, "stock": 200, "ai_class": "maggi"},
        {"name": "Kurkure", "brand": "PepsiCo", "category": "Snacks", "mrp": 20.0, "selling_price": 20.0, "stock": 150, "ai_class": "kurkure"},
        {"name": "Dairy Milk", "brand": "Cadbury", "category": "Chocolates", "mrp": 50.0, "selling_price": 50.0, "stock": 120, "ai_class": "dairymilk"},
        {"name": "Sprite", "brand": "Coca-Cola", "category": "Beverages", "mrp": 40.0, "selling_price": 40.0, "stock": 80, "ai_class": "sprite"},
        {"name": "Fanta", "brand": "Coca-Cola", "category": "Beverages", "mrp": 40.0, "selling_price": 40.0, "stock": 70, "ai_class": "fanta"},
        {"name": "Parle-G", "brand": "Parle", "category": "Biscuits", "mrp": 10.0, "selling_price": 10.0, "stock": 300, "ai_class": "parleg"},
        {"name": "Amul Milk", "brand": "Amul", "category": "Dairy", "mrp": 30.0, "selling_price": 30.0, "stock": 40, "ai_class": "amulmilk"},
        {"name": "Nescafe", "brand": "Nestle", "category": "Beverages", "mrp": 150.0, "selling_price": 150.0, "stock": 30, "ai_class": "nescafe"},
        {"name": "Bingo", "brand": "ITC", "category": "Snacks", "mrp": 20.0, "selling_price": 20.0, "stock": 90, "ai_class": "bingo"},
        {"name": "KitKat", "brand": "Nestle", "category": "Chocolates", "mrp": 25.0, "selling_price": 25.0, "stock": 110, "ai_class": "kitkat"},
        {"name": "Tata Salt", "brand": "Tata", "category": "Groceries", "mrp": 24.0, "selling_price": 24.0, "stock": 180, "ai_class": "tatasalt"}
    ]
    
    db_products = []
    for pd in products_data:
        p = db.query(Product).filter(Product.name == pd["name"]).first()
        if not p:
            p = Product(**pd)
            db.add(p)
            db.commit()
            db.refresh(p)
        db_products.append(p)

    # 3. Seed Offers
    print("Seeding offers...")
    lays = db.query(Product).filter(Product.name == "Lays").first()
    oreo = db.query(Product).filter(Product.name == "Oreo").first()
    coke = db.query(Product).filter(Product.name == "Coca-Cola").first()
    maggi = db.query(Product).filter(Product.name == "Maggi").first()

    offers_data = [
        {"product_id": lays.id, "offer_type": OfferType.BOGO, "buy_quantity": 1, "free_quantity": 1},
        {"product_id": oreo.id, "offer_type": OfferType.PERCENTAGE, "discount_percentage": 20.0},
        {"product_id": coke.id, "offer_type": OfferType.BUY_X_GET_Y, "buy_quantity": 2, "free_quantity": 1},
        {"product_id": maggi.id, "offer_type": OfferType.FLAT, "discount_amount": 5.0},
    ]

    for od in offers_data:
        if not db.query(Offer).filter(Offer.product_id == od["product_id"]).first():
            offer = Offer(**od, created_by=manager.id)
            db.add(offer)
            
    db.commit()
    print("Database seeding completed successfully.")
    db.close()

if __name__ == "__main__":
    seed_db()
