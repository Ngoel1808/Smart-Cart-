from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import Role, UserStatus

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: Role = Role.CUSTOMER

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    status: UserStatus
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[Role] = None
    status: Optional[UserStatus] = None
