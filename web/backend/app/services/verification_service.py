# app/services/verification_service.py

from sqlalchemy.orm import Session
from app.models.user_model import VerificationCode
from app.enums.delivery_type_enum import DeliveryType
import random

def create_verification_code(
    db: Session,
    email: str = None,
    phone_number: str = None,
    delivery_type: DeliveryType = DeliveryType.EMAIL,
) -> str:
    """Create and save a verification code in the database."""
    code = str(random.randint(100000, 999999))

    # Create a new or update an existing verification code
    verification_code = db.query(VerificationCode).filter(
        (VerificationCode.email == email) | (VerificationCode.phone_number == phone_number)
    ).first()

    if verification_code:
        verification_code.code = code
        verification_code.delivery_type = delivery_type
    else:
        verification_code = VerificationCode(
            email=email,
            phone_number=phone_number,
            code=code,
            delivery_type=delivery_type,
        )
        db.add(verification_code)

    db.commit()
    return code

def validate_verification_code(
    db: Session, email: str = None, phone_number: str = None, code: str = None
) -> bool:
    """Validate the verification code."""
    query = db.query(VerificationCode).filter(VerificationCode.code == code)

    if email:
        query = query.filter(VerificationCode.email == email)
    if phone_number:
        query = query.filter(VerificationCode.phone_number == phone_number)

    return query.first() is not None

def delete_verification_code(db: Session, email: str = None, phone_number: str = None):
    """Delete the verification code after successful verification."""
    query = db.query(VerificationCode)

    if email:
        query = query.filter(VerificationCode.email == email)
    if phone_number:
        query = query.filter(VerificationCode.phone_number == phone_number)

    query.delete()
    db.commit()
