from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.config.database import SessionLocal
from app.models.user_model import User, VerificationCode
from app.services.email_service import send_verification_email
from pydantic import BaseModel, EmailStr
import random
from passlib.hash import bcrypt

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class VerifyRequest(BaseModel):
    email: EmailStr
    code: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr

@router.post("/register")
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = bcrypt.hash(request.password)
    user = User(email=request.email, hashed_password=hashed_password, is_verified=False)
    db.add(user)
    db.commit()

    # Generate and send verification code
    code = str(random.randint(100000, 999999))
    verification_code = VerificationCode(email=request.email, code=code)
    db.add(verification_code)
    db.commit()

    await send_verification_email(request.email, code)

    return {"message": "User registered. Check your email for the verification code."}

@router.post("/verify")
def verify(request: VerifyRequest, db: Session = Depends(get_db)):
    code_entry = db.query(VerificationCode).filter(
        VerificationCode.email == request.email,
        VerificationCode.code == request.code,
    ).first()

    if not code_entry:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    user = db.query(User).filter(User.email == request.email).first()
    if user:
        user.is_verified = True
        db.delete(code_entry)
        db.commit()

    return {"message": "Email verified successfully"}

@router.post("/resend-verification")
async def resend_verification(request: ResendVerificationRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        raise HTTPException(status_code=400, detail="User is already verified")

    # Generate a new verification code
    code = str(random.randint(100000, 999999))

    # Check if there's an existing code and update it
    verification_code = db.query(VerificationCode).filter(VerificationCode.email == request.email).first()
    if verification_code:
        verification_code.code = code
    else:
        # Create a new code if none exists
        verification_code = VerificationCode(email=request.email, code=code)
        db.add(verification_code)

    db.commit()

    # Send the email
    await send_verification_email(request.email, code)

    return {"message": "Verification code resent successfully"}