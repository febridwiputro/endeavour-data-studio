from enum import Enum

class PerPageOptions(int, Enum):
    TEN = 10
    TWENTY = 20
    FIFTY = 50
    HUNDRED = 100
