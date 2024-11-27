# app/config/config.py
import os
import sys
from pydantic_settings import BaseSettings  # Correct import

# Set the path for the project root directory
this_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(this_path)

class Settings(BaseSettings):
    SERVER_HOST: str
    SERVER_PORT: int

    DATABASE_PORT: int
    POSTGRES_PASSWORD: str
    POSTGRES_USER: str
    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_HOSTNAME: str

    JWT_PUBLIC_KEY: str
    JWT_PRIVATE_KEY: str
    REFRESH_TOKEN_EXPIRES_IN: int
    ACCESS_TOKEN_EXPIRES_IN: int
    JWT_ALGORITHM: str

    CLIENT_ORIGIN: str

    class Config:
        env_file = os.path.join(this_path, ".env")  # Specify the environment file
        env_file_encoding = "utf-8"  # Specify encoding for the .env file
        extra = "allow"  # Allow extra fields in the .env file

settings = Settings()


# # app/config/config.py
# import os
# import sys
# from pydantic import BaseSettings

# # Set the path for the project root directory
# this_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
# sys.path.append(this_path)

# class Settings(BaseSettings):
#     SERVER_HOST: str
#     SERVER_PORT: int

#     DATABASE_PORT: int
#     POSTGRES_PASSWORD: str
#     POSTGRES_USER: str
#     POSTGRES_DB: str
#     POSTGRES_HOST: str
#     POSTGRES_HOSTNAME: str

#     JWT_PUBLIC_KEY: str
#     JWT_PRIVATE_KEY: str
#     REFRESH_TOKEN_EXPIRES_IN: int
#     ACCESS_TOKEN_EXPIRES_IN: int
#     JWT_ALGORITHM: str

#     CLIENT_ORIGIN: str

#     class Config:
#         env_file = os.path.join(this_path, ".env")  # Specify the environment file
#         env_file_encoding = "utf-8"  # Specify encoding for the .env file
#         extra = "allow"  # Allow extra fields in the .env file

# settings = Settings()


# import os
# import sys
# from pydantic_settings import BaseSettings

# # Set the path for the project root directory
# this_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
# sys.path.append(this_path)

# class Settings(BaseSettings):
#     # db_name: str
#     # db_user: str
#     # db_password: str
#     # db_port: int
#     # db_host: str
#     SERVER_HOST: str
#     SERVER_PORT: int

#     DATABASE_PORT: int
#     POSTGRES_PASSWORD: str
#     POSTGRES_USER: str
#     POSTGRES_DB: str
#     POSTGRES_HOST: str
#     POSTGRES_HOSTNAME: str

#     JWT_PUBLIC_KEY: str
#     JWT_PRIVATE_KEY: str
#     REFRESH_TOKEN_EXPIRES_IN: int
#     ACCESS_TOKEN_EXPIRES_IN: int
#     JWT_ALGORITHM: str

#     CLIENT_ORIGIN: str

#     class Config:
#         env_file = os.path.join(this_path, ".env")
#         extra = "allow"  # Allow extra fields

# settings = Settings()


# import os
# import sys
# from pydantic_settings import BaseSettings

# this_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
# sys.path.append(this_path)

# class Settings(BaseSettings):
#     host: str
#     port: int

#     class Config:
#         env_file = os.path.join(this_path, ".env")

# settings = Settings()