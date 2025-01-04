from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UploadDataSchema(BaseModel):
    id: int
    data_id: int
    file_name: str
    created_by: int
    updated_by: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
