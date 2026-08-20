from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core import security
from app.schemas.auth import TokenPayload
from app.models.user import User, Role, UserStatus
from app.database.database import get_db

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (jwt.PyJWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = db.query(User).filter(User.id == token_data.sub).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.status != UserStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user

def require_manager(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != Role.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="The user doesn't have enough privileges"
        )
    return current_user

def require_staff(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != Role.STAFF:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="The user doesn't have enough privileges"
        )
    return current_user

def require_customer(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != Role.CUSTOMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="The user doesn't have enough privileges"
        )
    return current_user

def require_manager_or_staff(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in (Role.MANAGER, Role.STAFF):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="The user doesn't have enough privileges"
        )
    return current_user
