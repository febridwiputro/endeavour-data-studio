from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.hash import bcrypt

from app.services.auth_service import authenticate_user, generate_tokens
from app.models.user_model import UserModel
from app.schemas.user_schema import (
    UserResponse,
    UserInfoResponse,
    UserCreateRequest,
    UserUpdateRequest,
    UserUpdatePasswordRequest,
)
from app.utils.jwt_util import decode_jwt
from app.config.database import get_db
from app.models.user_model import UserModel
from app.utils.token_bearer_util import JWTBearer
from app.utils.response_utils import standard_response


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
jwt_bearer = JWTBearer()


def get_user_or_404(db: Session, user_id: int) -> UserModel:
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

def get_current_user(payload: dict, db: Session = Depends(get_db)) -> UserModel:
    """
    Extract and validate the current user from the decoded JWT payload.
    """
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token: missing email")

    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@router.get("/me")
async def get_me(payload: dict = Depends(jwt_bearer), db: Session = Depends(get_db)):
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    # Return user information
    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="USER_DETAILS_RETRIEVED",
        data={
            "email": user.email,
            "full_name": user.full_name,
            "user_photo": user.user_photo,
        },
    )


# @router.get("/me", response_model=None, status_code=status.HTTP_200_OK)
# async def get_me(payload: dict = Depends(jwt_bearer), db: Session = Depends(get_db)):
#     """
#     Endpoint to get the currently authenticated user's details.
#     """
#     current_user = get_current_user(payload, db)

#     # Filter the necessary fields for UserInfoResponse
#     filtered_user_data = UserInfoResponse(
#         email=current_user.email,
#         phone_number=current_user.phone_number,
#         full_name=current_user.full_name,
#         user_photo=current_user.user_photo,
#     )

#     return standard_response(
#         "success",
#         status.HTTP_200_OK,
#         "USER_DETAILS_RETRIEVED",
#         filtered_user_data.dict(),  # Convert Pydantic model to a dict
#     )

# @router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
# async def get_me(payload: dict = Depends(jwt_bearer), db: Session = Depends(get_db)):
#     """
#     Endpoint to get the currently authenticated user's details.
#     """
#     current_user = get_current_user(payload, db)
#     return current_user

# def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
#     """
#     Extract and validate the current user from the access token.
#     """
#     try:
#         payload = decode_jwt(token)
#         email = payload.get("sub")
#         if not email:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token: missing email")
        
#         user = db.query(User).filter(User.email == email).first()
#         if not user:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
#         return user
#     except Exception as e:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

# @router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
# async def get_me(current_user: User = Depends(get_current_user)):
#     """
#     Endpoint to get the currently authenticated user's details.
#     """
#     return current_user

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(request: UserCreateRequest, db: Session = Depends(get_db)):
    existing_user = db.query(UserModel).filter(UserModel.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    hashed_password = bcrypt.hash(request.password)
    user = UserModel(
        email=request.email,
        hashed_password=hashed_password,
        is_verified=request.is_verified or False,
        is_superuser=request.is_superuser or False,
    )
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    return user


@router.get("/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user_or_404(db, user_id)
    return user


@router.patch("/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def update_user(user_id: int, request: UserUpdateRequest, db: Session = Depends(get_db)):
    user = get_user_or_404(db, user_id)

    if request.email and request.email != user.email:
        existing_user = db.query(UserModel).filter(UserModel.email == request.email).first()
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
        user.email = request.email

    if request.is_verified is not None:
        user.is_verified = request.is_verified

    if request.is_superuser is not None:
        user.is_superuser = request.is_superuser

    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}/password", status_code=status.HTTP_200_OK)
async def update_user_password(user_id: int, request: UserUpdatePasswordRequest, db: Session = Depends(get_db)):
    user = get_user_or_404(db, user_id)

    if not bcrypt.verify(request.old_password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid old password")

    user.hashed_password = bcrypt.hash(request.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user_or_404(db, user_id)
    try:
        db.delete(user)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    return None


@router.get("/", response_model=list[UserResponse], status_code=status.HTTP_200_OK)
async def list_users(db: Session = Depends(get_db)):
    users = db.query(UserModel).all()
    return users
