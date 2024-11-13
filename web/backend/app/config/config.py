# app/config/config.py

import os
import sys
from pydantic_settings import BaseSettings

# Set the path for the project root directory
this_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(this_path)

class Settings(BaseSettings):
    db_name: str
    db_user: str
    db_password: str
    db_port: int
    db_host: str
    host: str
    port: int

    class Config:
        env_file = os.path.join(this_path, ".env")
        extra = "allow"  # Allow extra fields

settings = Settings()


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