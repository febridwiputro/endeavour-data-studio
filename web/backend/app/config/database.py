# app/config/database.py

import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic_settings import BaseSettings

# Set the path for the project root directory
this_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(this_path)

# Define the settings class
class Settings(BaseSettings):
    db_name: str
    db_user: str
    db_password: str
    db_port: int
    db_host: str  # Default host if not specified

    class Config:
        env_file = os.path.join(this_path, ".env")
        extra = "allow"  # Allow extra fields

# Load the settings
settings = Settings()

# Construct the database URL
database_url = f"postgresql://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}/{settings.db_name}"

# Create a new SQLAlchemy engine instance
engine = create_engine(database_url)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for declarative models
Base = declarative_base()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
