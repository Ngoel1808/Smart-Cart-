from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database.database import get_db
from app.models.user import User
from app.models.offer import Offer
from app.schemas.offer import OfferCreate, OfferUpdate, OfferResponse
from app.core.dependencies import get_current_user, require_manager_or_staff

router = APIRouter()

@router.get("", response_model=List[OfferResponse])
def get_all_offers(db: Session = Depends(get_db), current_user: User = Depends(require_manager_or_staff)):
    """
    Get all offers (active and inactive). Manager/Staff only.
    """
    return db.query(Offer).all()

@router.get("/active", response_model=List[OfferResponse])
def get_active_offers(db: Session = Depends(get_db)):
    """
    Get only active offers. Open to all (including Customers).
    """
    return db.query(Offer).filter(Offer.is_active == True).all()

@router.get("/{offer_id}", response_model=OfferResponse)
def get_offer(offer_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_manager_or_staff)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return offer

@router.post("", response_model=OfferResponse)
def create_offer(
    offer_in: OfferCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_staff)
):
    db_offer = Offer(**offer_in.model_dump(), created_by=current_user.id)
    db.add(db_offer)
    db.commit()
    db.refresh(db_offer)
    return db_offer

@router.put("/{offer_id}", response_model=OfferResponse)
def update_offer(
    offer_id: int, 
    offer_in: OfferUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_staff)
):
    db_offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not db_offer:
        raise HTTPException(status_code=404, detail="Offer not found")
        
    update_data = offer_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_offer, key, value)
        
    db.commit()
    db.refresh(db_offer)
    return db_offer

@router.delete("/{offer_id}")
def delete_offer(offer_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_manager_or_staff)):
    db_offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not db_offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    db_offer.is_active = False # Soft delete
    db.commit()
    return {"success": True, "message": "Offer deactivated"}
