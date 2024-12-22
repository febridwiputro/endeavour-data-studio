# app/models/user_model.py

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum, DateTime, Text
from datetime import datetime
from sqlalchemy.dialects.postgresql import ENUM

from app.config.database import Base
from app.enums.delivery_type_enum import DeliveryType


delivery_type_enum = ENUM(DeliveryType, name="deliverytype", create_type=False)

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_verified = Column(Boolean, default=False)
    is_superuser = Column(Boolean, default=False)
    full_name = Column(String, nullable=True)
    user_photo = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class VerificationCode(Base):
    __tablename__ = "verification_codes"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, ForeignKey("users.email"), index=True)
    phone_number = Column(String, index=True, nullable=True)
    code = Column(String, nullable=False)
    delivery_type = Column(delivery_type_enum, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# import uuid
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy import TIMESTAMP, Column, String, Boolean, text, Integer
# from sqlalchemy.dialects.postgresql import UUID

# from app.config.database import Base

# Base = declarative_base()

# class User(Base):
#     __tablename__ = 'users'
#     id = Column(UUID(as_uuid=True), primary_key=True, nullable=False,
#                 default=uuid.uuid4)
#     name = Column(String,  nullable=False)
#     email = Column(String, unique=True, nullable=False)
#     password = Column(String, nullable=False)
#     photo = Column(String, nullable=True)
#     verified = Column(Boolean, nullable=False, server_default='False')
#     role = Column(String, server_default='user', nullable=False)
#     created_at = Column(TIMESTAMP(timezone=True),
#                         nullable=False, server_default=text("now()"))
#     updated_at = Column(TIMESTAMP(timezone=True),
#                         nullable=False, server_default=text("now()"))
