import base64
from typing import List
from fastapi import Depends, HTTPException, status
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.config.database import get_db  # Ensure this is correct
from app import models  # Ensure the models are accessible

from app.config.config import settings

class Settings(BaseModel):
    authjwt_algorithm: str = settings.JWT_ALGORITHM
    authjwt_decode_algorithms: List[str] = [settings.JWT_ALGORITHM]
    authjwt_token_location: set = {"cookies", "headers"}
    authjwt_access_cookie_key: str = "access_token"
    authjwt_refresh_cookie_key: str = "refresh_token"
    authjwt_public_key: str = base64.b64decode(settings.JWT_PUBLIC_KEY).decode("utf-8")
    authjwt_private_key: str = base64.b64decode(settings.JWT_PRIVATE_KEY).decode("utf-8")


@AuthJWT.load_config
def get_config():
    return Settings()


def require_user(db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()  # Ensures token is required
        user_id = Authorize.get_jwt_subject()  # Get user ID from token subject
        user = db.query(models.User).filter(models.User.id == user_id).first()

        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="User not found")

        if not user.verified:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail="User is not verified")

    except Exception as e:
        error = e.__class__.__name__
        if error == "MissingTokenError":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Authentication token is missing")
        if error == "InvalidHeaderError":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Invalid token header")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Token is invalid or has expired")

    return user_id


# def require_user(db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
#     try:
#         Authorize.jwt_required()
#         user_id = Authorize.get_jwt_subject()
#         user = db.query(models.User).filter(models.User.id == user_id).first()

#         if not user:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, detail="User no longer exists"
#             )

#         if not user.verified:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="Please verify your account",
#             )
#         return user

#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Token is invalid or has expired",
#         )


# import base64
# from typing import List
# from fastapi import Depends, HTTPException, status
# from fastapi_jwt_auth import AuthJWT
# from pydantic import BaseModel
# from sqlalchemy.orm import Session

# from app.config.config import settings

# class Settings(BaseModel):
#     authjwt_algorithm: str = settings.JWT_ALGORITHM
#     authjwt_decode_algorithms: List[str] = [settings.JWT_ALGORITHM]
#     authjwt_token_location: set = {'cookies', 'headers'}
#     authjwt_access_cookie_key: str = 'access_token'
#     authjwt_refresh_cookie_key: str = 'refresh_token'
#     authjwt_public_key: str = base64.b64decode(
#         settings.JWT_PUBLIC_KEY).decode('utf-8')
#     authjwt_private_key: str = base64.b64decode(
#         settings.JWT_PRIVATE_KEY).decode('utf-8')


# @AuthJWT.load_config
# def get_config():
#     return Settings()


# class NotVerified(Exception):
#     pass


# class UserNotFound(Exception):
#     pass


# def require_user(db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
#     try:
#         Authorize.jwt_required()
#         user_id = Authorize.get_jwt_subject()
#         user = db.query(models.User).filter(models.User.id == user_id).first()

#         if not user:
#             raise UserNotFound('User no longer exist')

#         if not user.verified:
#             raise NotVerified('You are not verified')

#     except Exception as e:
#         error = e.__class__.__name__
#         print(error)
#         if error == 'MissingTokenError':
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, detail='You are not logged in')
#         if error == 'UserNotFound':
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, detail='User no longer exist')
#         if error == 'NotVerified':
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, detail='Please verify your account')
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail='Token is invalid or has expired')
#     return user_id