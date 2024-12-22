from pydantic import BaseModel
from app.enums.annotation_type_enum import AnnotationType


# Pydantic schema for request validation
class CreateAnnotationProjectRequest(BaseModel):
    name: str
    description: str | None = None
    annotation_type: AnnotationType
    project_photo_url: str | None = None
    menu_id: int
    created_by: int