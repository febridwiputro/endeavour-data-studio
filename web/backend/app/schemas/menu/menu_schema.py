from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MenuResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    type: str
    is_active: bool
    metadata: Optional[dict]
    logo_url: Optional[str]
    created_by: int
    updated_by: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

from pydantic import BaseModel, Field
from typing import Optional


class MenuCreate(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str]
    type: str
    is_active: bool = True
    metadata: Optional[dict]
    logo_url: Optional[str]

    class Config:
        from_attributes = True
