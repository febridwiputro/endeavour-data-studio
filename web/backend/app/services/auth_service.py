# app/services/auth_service.py

from datetime import datetime, timedelta
import jwt
from passlib.hash import bcrypt
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user_model import UserModel
from app.schemas.auth_schema import LoginRequest
from app.utils.jwt_util import generate_jwt, decode_jwt  # Import utility functions
from app.config.config import settings  # Assuming settings include secret keys and other configs

ACCESS_TOKEN_LIFETIME_SECONDS = 15 * 60  # 15 minutes
REFRESH_TOKEN_LIFETIME_SECONDS = 60 * 60  # 1 hour

def authenticate_user(db: Session, email: str, password: str) -> UserModel:
    """Authenticate the user."""
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    if not bcrypt.verify(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="User account is not verified")
    return user

def generate_tokens(user):
    """
    Generate access and refresh tokens for a user.

    :param user: User instance.
    :return: Dict containing access and refresh tokens.
    """
    access_token = generate_jwt(
        data={"sub": user.email, "type": "access"},
        lifetime_seconds=settings.ACCESS_TOKEN_EXPIRES_IN,
    )

    refresh_token = generate_jwt(
        data={"sub": user.email, "type": "refresh"},
        lifetime_seconds=settings.REFRESH_TOKEN_EXPIRES_IN,
    )

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

def refresh_access_token(refresh_token: str) -> str:
    """Refresh access token using a valid refresh token."""
    try:
        decoded = decode_jwt(
            encoded_jwt=refresh_token,
            secret=settings.SECRET_KEY,
            audience=["refresh"],
        )
        user_id = decoded["sub"]
        return generate_jwt(
            data={"sub": user_id, "aud": ["access"]},
            secret=settings.SECRET_KEY,
            lifetime_seconds=ACCESS_TOKEN_LIFETIME_SECONDS,
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
