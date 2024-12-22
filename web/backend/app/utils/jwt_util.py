# app/utils/jwt_utils.py

from datetime import datetime, timedelta, timezone
from typing import Any, Optional, Union
from pydantic import SecretStr
import jwt
from app.config.config import settings

SecretType = Union[str, SecretStr]
JWT_ALGORITHM = settings.JWT_ALGORITHM


def _get_secret_value(secret: SecretType) -> str:
    if isinstance(secret, SecretStr):
        return secret.get_secret_value()
    return secret


def generate_jwt(
    data: dict,
    lifetime_seconds: Optional[int] = None,
) -> str:
    """
    Generate a JWT token using symmetric or asymmetric keys.

    :param data: Payload to encode.
    :param lifetime_seconds: Token lifetime in seconds.
    :return: Encoded JWT string.
    """
    payload = data.copy()
    if lifetime_seconds:
        expire = datetime.now(timezone.utc) + timedelta(seconds=lifetime_seconds)
        payload["exp"] = expire

    if JWT_ALGORITHM in {"HS256", "HS384", "HS512"}:  # Symmetric
        secret = _get_secret_value(settings.SECRET_KEY)
        return jwt.encode(payload, secret, algorithm=JWT_ALGORITHM)

    # Asymmetric
    private_key = settings.JWT_PRIVATE_KEY
    return jwt.encode(payload, private_key, algorithm=JWT_ALGORITHM)


def decode_jwt(
    encoded_jwt: str,
    audience: Optional[list[str]] = None,
) -> dict[str, Any]:
    """
    Decode and verify a JWT token.

    :param encoded_jwt: Encoded JWT string.
    :param audience: Optional audience claim validation.
    :return: Decoded payload.
    """
    options = {"verify_aud": bool(audience)}
    if JWT_ALGORITHM in {"HS256", "HS384", "HS512"}:  # Symmetric
        secret = _get_secret_value(settings.SECRET_KEY)
        return jwt.decode(
            encoded_jwt,
            secret,
            audience=audience,
            algorithms=[JWT_ALGORITHM],
            options=options,
        )

    # Asymmetric
    public_key = settings.JWT_PUBLIC_KEY
    return jwt.decode(
        encoded_jwt,
        public_key,
        audience=audience,
        algorithms=[JWT_ALGORITHM],
        options=options,
    )
