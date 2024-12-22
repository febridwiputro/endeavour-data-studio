# app/config/config.py

import os
import sys
from pydantic_settings import BaseSettings
from typing import ClassVar, Set
from pydantic import ValidationError

# Define supported algorithms
class AlgorithmSettings:
    __asymmetric_algos__: ClassVar[Set[str]] = {
        "ES256", "ES256K", "ES384", "ES512",
        "RS256", "RS384", "RS512",
        "PS256", "PS384", "PS512",
        "EdDSA",
    }
    __symmetric_algos__: ClassVar[Set[str]] = {"HS256", "HS384", "HS512"}

this_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(this_path)

class Settings(BaseSettings):
    # JWT configuration
    JWT_ALGORITHM: str = "RS256"    
    SECRET_KEY: str
    JWT_PRIVATE_KEY: str = None
    JWT_PUBLIC_KEY: str = None
    ACCESS_TOKEN_EXPIRES_IN: int = 900  # 15 minutes by default
    REFRESH_TOKEN_EXPIRES_IN: int = 3600  # 1 hour by default

    # Database configuration
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    DATABASE_PORT: int
    POSTGRES_DB: str

    # Server configuration
    SERVER_HOST: str
    SERVER_PORT: int
    CLIENT_ORIGIN: str
    YOLO_MODEL_PATH: str

    class Config:
        env_file = os.path.join(this_path, ".env")
        env_file_encoding = "utf-8"
        extra = "allow"

    def validate_jwt_configuration(self):
        """Validate the JWT configuration based on the selected algorithm."""
        algorithm = self.JWT_ALGORITHM
        if algorithm in AlgorithmSettings.__symmetric_algos__:
            if not self.SECRET_KEY:
                raise ValidationError(f"SECRET_KEY is required for {algorithm}")
        elif algorithm in AlgorithmSettings.__asymmetric_algos__:
            if not self.JWT_PRIVATE_KEY or not self.JWT_PUBLIC_KEY:
                raise ValidationError(
                    f"Both JWT_PRIVATE_KEY and JWT_PUBLIC_KEY are required for {algorithm}"
                )
        else:
            raise ValidationError(f"Unsupported JWT algorithm: {algorithm}")

settings = Settings()
settings.validate_jwt_configuration()