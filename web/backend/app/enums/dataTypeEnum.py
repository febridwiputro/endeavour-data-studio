from enum import Enum

class DataTypeEnum(str, Enum):
    IMAGE = "IMAGE"
    AUDIO = "AUDIO"
    TEXT = "TEXT"
    VIDEO = "VIDEO"