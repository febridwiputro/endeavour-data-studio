from pydantic import BaseModel, Field
from typing import Optional


class CreateClassOrTagRequest(BaseModel):
    project_id: int
    class_name: str
    class_color: str

class UpdateClassOrTagRequest(BaseModel):
    project_id: int
    id: int
    tag_name: str
    class_name: str
    class_color: str

class DeleteClassOrTagRequest(BaseModel):
    class_id: int
    project_id: int = None