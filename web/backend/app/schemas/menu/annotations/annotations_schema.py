from pydantic import BaseModel, Field
from typing import Optional

class CreateAnnotationProjectRequest(BaseModel):
    name: str = Field(..., title="Project Name", max_length=255)
    description: Optional[str] = Field(None, title="Project Description")
    project_photo_url: Optional[str] = Field(None, title="Project Photo URL")
    sub_feature_2_id: Optional[int] = Field(None, title="Sub Feature 2 ID")
