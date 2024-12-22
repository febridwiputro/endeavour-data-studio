from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    is_verified: bool = False
    is_superuser: bool = False


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    phone_number: Optional[str] = None
    full_name: Optional[str] = None
    user_photo: Optional[str] = None
    is_verified: bool
    is_superuser: bool

    class Config:
        from_attributes = True  # Untuk Pydantic v2


class UserInfoResponse(BaseModel):
    email: str
    phone_number: Optional[str] = None
    full_name: Optional[str] = None
    user_photo: Optional[str] = None


class UserCreateRequest(UserBase):
    password: str = Field(..., min_length=8)


class UserUpdateRequest(BaseModel):
    email: EmailStr = None
    is_verified: bool = None
    is_superuser: bool = None


class UserUpdatePasswordRequest(BaseModel):
    old_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)


# from datetime import datetime
# import uuid
# from pydantic import BaseModel, EmailStr, constr


# class UserBaseSchema(BaseModel):
#     name: str
#     email: EmailStr
#     photo: str

#     class Config:
#         orm_mode = True


# class CreateUserSchema(UserBaseSchema):
#     password: constr(min_length=8)
#     passwordConfirm: str
#     role: str = 'user'
#     verified: bool = False


# class LoginUserSchema(BaseModel):
#     email: EmailStr
#     password: constr(min_length=8)


# class UserResponse(UserBaseSchema):
#     id: uuid.UUID
#     created_at: datetime
#     updated_at: datetime

