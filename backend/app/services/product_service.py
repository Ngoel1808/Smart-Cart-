from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

class ProductService:
    @staticmethod
    def get_products(db: Session, skip: int = 0, limit: int = 100, 
                     search: Optional[str] = None, category: Optional[str] = None, 
                     brand: Optional[str] = None, is_active: Optional[bool] = None) -> List[Product]:
        query = db.query(Product)
        if search:
            query = query.filter(or_(Product.name.ilike(f"%{search}%"), Product.description.ilike(f"%{search}%")))
        if category:
            query = query.filter(Product.category.ilike(f"%{category}%"))
        if brand:
            query = query.filter(Product.brand.ilike(f"%{brand}%"))
        if is_active is not None:
            query = query.filter(Product.is_active == is_active)
            
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def get_product(db: Session, product_id: int) -> Optional[Product]:
        return db.query(Product).filter(Product.id == product_id).first()

    @staticmethod
    def create_product(db: Session, product_in: ProductCreate) -> Product:
        db_product = Product(**product_in.model_dump())
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product

    @staticmethod
    def update_product(db: Session, product_id: int, product_in: ProductUpdate) -> Optional[Product]:
        db_product = ProductService.get_product(db, product_id)
        if not db_product:
            return None
        
        update_data = product_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_product, key, value)
            
        db.commit()
        db.refresh(db_product)
        return db_product

product_service = ProductService()
