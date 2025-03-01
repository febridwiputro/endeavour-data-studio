from pydantic import BaseModel
from typing import Optional, List

class DeleteTasksRequest(BaseModel):
    project_id: int
    task_ids: List[int]

class DeleteAnnotationsRequest(BaseModel):
    project_id: int
    task_ids: List[int]