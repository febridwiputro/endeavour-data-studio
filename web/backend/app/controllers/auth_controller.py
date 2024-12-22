# app/controllers/auth_controller.py

from fastapi import APIRouter, HTTPException, Depends, status, Response
from fastapi.security import OAuth2PasswordRequestForm
import random
from sqlalchemy.orm import Session
from passlib.hash import bcrypt

from app.config.database import get_db
from app.services.verification_service import (
    create_verification_code,
    validate_verification_code,
    delete_verification_code,
)
from app.schemas.verification_schema import EmailVerificationRequest, PhoneVerificationRequest, ResendVerificationRequest, RegisterRequest
from app.enums.delivery_type_enum import DeliveryType
from app.services.notification_service import send_verification_email, send_verification_sms, send_verification_whatsapp
from app.models.user_model import UserModel, VerificationCode
from app.services.auth_service import authenticate_user, generate_tokens, refresh_access_token
from app.schemas.auth_schema import LoginRequest, RefreshTokenRequest, ForgotPasswordRequest, PasswordResetRequest, PasswordUpdateRequest
from app.schemas.verification_schema import VerifyRequest
from app.utils.response_utils import standard_response

router = APIRouter()

@router.post("/register")
async def register(request: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    # Check if email is already registered
    user = db.query(UserModel).filter(UserModel.email == request.email).first()
    if user:
        response.status_code = 400
        return standard_response(
            "error",
            400,
            "EMAIL_ALREADY_REGISTERED",
            {"email": request.email},
        )

    # Hash password and create new user
    hashed_password = bcrypt.hash(request.password)
    user = UserModel(email=request.email, hashed_password=hashed_password, is_verified=False, is_superuser=False)
    db.add(user)
    db.commit()

    # Generate and send verification code
    code = str(random.randint(100000, 999999))
    verification_code = VerificationCode(
        email=request.email, code=code, delivery_type=DeliveryType.EMAIL
    )
    db.add(verification_code)
    db.commit()

    await send_verification_email(request.email, code)

    # Return standardized response
    return standard_response(
        "success",
        200,
        "USER_REGISTERED",
        {"email": request.email},
    )

@router.post("/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, email=request.email, password=request.password)
    tokens = generate_tokens(user)

    # Save the refresh token in the database
    user.refresh_token = tokens["refresh_token"]
    db.commit()

    return tokens


# @router.post("/register")
# async def register(request: RegisterRequest, db: Session = Depends(get_db)):
#     # Validasi apakah email sudah terdaftar
#     user = db.query(UserModel).filter(UserModel.email == request.email).first()
#     if user:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     # Pengecekan sudah dilakukan pada validator di `RegisterRequest`
#     # Hash password
#     hashed_password = bcrypt.hash(request.password)
#     user = UserModel(email=request.email, hashed_password=hashed_password, is_verified=False, is_superuser=False)
#     db.add(user)
#     db.commit()

#     # Generate and send verification code
#     code = str(random.randint(100000, 999999))
#     verification_code = VerificationCode(
#         email=request.email, code=code, delivery_type=DeliveryType.EMAIL  # Set delivery_type explicitly
#     )
#     db.add(verification_code)
#     db.commit()

#     await send_verification_email(request.email, code)

#     return {"message": "User registered. Check your email for the verification code."}

@router.post("/verification/email")
async def send_verification_email_endpoint(
    request: EmailVerificationRequest, db: Session = Depends(get_db)
):
    # Generate and save code
    code = create_verification_code(db, email=request.email, delivery_type=DeliveryType.EMAIL)

    # Send code via email
    await send_verification_email(request.email, code)
    return {"message": "Verification code sent to email"}

@router.post("/verification/phone")
async def send_verification_phone_endpoint(
    request: PhoneVerificationRequest, db: Session = Depends(get_db)
):
    # Generate and save code
    code = create_verification_code(
        db, phone_number=request.phone_number, delivery_type=request.delivery_type
    )

    # Send code via SMS or WhatsApp
    if request.delivery_type == DeliveryType.SMS:
        send_verification_sms(request.phone_number, code)
    elif request.delivery_type == DeliveryType.WHATSAPP:
        send_verification_whatsapp(request.phone_number, code)

    return {"message": f"Verification code sent via {request.delivery_type}"}

@router.post("/verify-code")
def verify(request: VerifyRequest, db: Session = Depends(get_db)):
    """Verify email using the provided code."""
    # Check if the code exists
    code_entry = db.query(VerificationCode).filter(
        VerificationCode.email == request.email,
        VerificationCode.code == request.code,
    ).first()

    if not code_entry:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    # Mark user as verified
    user = db.query(UserModel).filter(UserModel.email == request.email).first()
    if user:
        user.is_verified = True
        db.delete(code_entry)  # Remove the verification code after use
        db.commit()

    return {"message": "Email verified successfully"}


# @router.post("/verify-code")
# def verify(request: VerifyRequest, db: Session = Depends(get_db)):
#     code_entry = db.query(VerificationCode).filter(
#         VerificationCode.email == request.email,
#         VerificationCode.code == request.code,
#     ).first()

#     if not code_entry:
#         raise HTTPException(status_code=400, detail="Invalid verification code")

#     user = db.query(UserModel).filter(UserModel.email == request.email).first()
#     if user:
#         user.is_verified = True
#         db.delete(code_entry)
#         db.commit()

#     return {"message": "Email verified successfully"}

@router.post("/resend-code")
async def resend_verification(request: ResendVerificationRequest, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == request.email).first()
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

@router.post("/refresh-token")
async def refresh_token(request: RefreshTokenRequest):
    new_access_token = refresh_access_token(request.refresh_token)
    return {"access_token": new_access_token}

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Request a password reset code."""
    user = db.query(UserModel).filter(UserModel.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate a reset code
    reset_code = create_verification_code(db, email=user.email)

    # Send the reset code via email
    await send_verification_email(user.email, reset_code)

    return {"message": "Password reset code sent to your email."}


@router.post("/password-reset")
async def password_reset(request: PasswordResetRequest, db: Session = Depends(get_db)):
    """Verify the reset code and allow the user to reset their password."""
    # Validate the reset code
    if not validate_verification_code(db, email=request.email, code=request.code):
        raise HTTPException(status_code=400, detail="Invalid or expired reset code")

    # Delete the reset code after validation
    delete_verification_code(db, email=request.email)

    return {"message": "Reset code verified successfully. You can now update your password."}


@router.post("/password-update")
async def password_update(request: PasswordUpdateRequest, db: Session = Depends(get_db)):
    """Update the user's password."""
    user = db.query(UserModel).filter(UserModel.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Hash the new password and update the user record
    user.hashed_password = bcrypt.hash(request.new_password)
    db.commit()

    return {"message": "Password updated successfully."}



# @router.post("/verify")
# async def verify_code(
#     email: str = None,
#     phone_number: str = None,
#     code: str = None,
#     db: Session = Depends(get_db),
# ):
#     # Validate code
#     if not validate_verification_code(db, email=email, phone_number=phone_number, code=code):
#         raise HTTPException(status_code=400, detail="Invalid verification code")

#     # Delete code after validation
#     delete_verification_code(db, email=email, phone_number=phone_number)
#     return {"message": "Verification successful"}

# @router.post("/login")
# async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     """
#     Authenticate user and generate access and refresh tokens.
#     """
#     # Authenticate user using username as email
#     user = authenticate_user(db, email=form_data.username, password=form_data.password)
#     if not user:
#         raise HTTPException(status_code=400, detail="Invalid username or password")

#     # Generate tokens
#     tokens = generate_tokens(user)
#     user.refresh_token = tokens["refresh_token"]
#     db.commit()

#     return {"access_token": tokens["access_token"], "token_type": "bearer"}
