# app/schemas/verification_schema.py

from pydantic import BaseModel, EmailStr, Field, validator, constr
from app.enums.delivery_type_enum import DeliveryType


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    confirm_password: str

    @validator("confirm_password")
    def passwords_match(cls, confirm_password, values):
        if "password" in values and confirm_password != values["password"]:
            raise ValueError("Passwords do not match.")
        return confirm_password

class VerifyRequest(BaseModel):
    email: EmailStr
    code: str

    @validator("code")
    def validate_code(cls, code):
        if not code.isdigit() or len(code) != 6:
            raise ValueError("Code must be a 6-digit number.")
        return code

class ResendVerificationRequest(BaseModel):
    email: EmailStr

class EmailVerificationRequest(BaseModel):
    email: EmailStr

class PhoneVerificationRequest(BaseModel):
    phone_number: str
    delivery_type: DeliveryType
