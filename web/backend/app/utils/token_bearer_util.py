from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt_util import decode_jwt
from app.utils.response_utils import standard_response


class JWTBearer(HTTPBearer):
    """
    Custom HTTPBearer dependency for validating JWT tokens.
    """
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> dict:
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if not credentials:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=standard_response(
                    status="error",
                    status_code=status.HTTP_403_FORBIDDEN,
                    message_code="AUTHORIZATION_TOKEN_MISSING",
                    data=None,
                )
            )
        if credentials.scheme != "Bearer":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=standard_response(
                    status="error",
                    status_code=status.HTTP_403_FORBIDDEN,
                    message_code="INVALID_AUTHENTICATION_SCHEME",
                    data=None,
                )
            )

        try:
            payload = decode_jwt(credentials.credentials)
            if "sub" not in payload:  # Check for required field
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=standard_response(
                        status="error",
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        message_code="INVALID_OR_EXPIRED_TOKEN_MISSING_USER_INFO",
                        data=None,
                    )
                )
            return payload  # Return decoded JWT payload
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=standard_response(
                    status="error",
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    message_code="INVALID_OR_EXPIRED_TOKEN",
                    data=str(e),
                )
            )



# class JWTBearer(HTTPBearer):
#     """
#     Custom HTTPBearer dependency for validating JWT tokens.
#     """
#     def __init__(self, auto_error: bool = True):
#         super(JWTBearer, self).__init__(auto_error=auto_error)

#     async def __call__(self, request: Request) -> dict:
#         credentials: HTTPAuthorizationCredentials = await super().__call__(request)
#         if not credentials:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN, detail="Authorization token is missing"
#             )
#         if not credentials.scheme == "Bearer":
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN, detail="Invalid authentication scheme"
#             )

#         try:
#             payload = decode_jwt(credentials.credentials)
#             return payload  # Return decoded JWT payload
#         except Exception as e:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token"
#             )
