from enum import Enum


class ResponseStatus(str, Enum):
    """
    Enum for response status.
    """
    SUCCESS = "success"
    ERROR = "error"