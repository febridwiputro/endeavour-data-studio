from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config.database import get_db
# from app.schemas.models import models, schemas, oauth2
from app.schemas.user_schema import UserResponse
from app.models.user_model import User
from app.utils.oauth2 import require_user

router = APIRouter()


@router.get('/me', response_model=UserResponse)
def get_me(db: Session = Depends(get_db), user_id: str = Depends(require_user)):
    user = db.query(User).filter(User.id == user_id).first()
    return user

