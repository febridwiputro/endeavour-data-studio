from fastapi import APIRouter, HTTPException, Depends, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.config.database import get_db
from app.models.menu.annotations.models_model import ModelsModel
from app.enums.modelTypeEnum import ModelTypeEnum
from app.utils.response_utils import standard_response
from app.utils.token_bearer_util import JWTBearer

router = APIRouter()
jwt_bearer = JWTBearer()

# Request schemas
class CreateModelRequest(BaseModel):
    project_id: int
    model_type: ModelTypeEnum
    name: str
    api_url: Optional[str] = None
    api_key: Optional[str] = None
    version: Optional[str] = None

class UpdateModelRequest(BaseModel):
    project_id: Optional[int] = None
    name: Optional[str] = None
    api_url: Optional[str] = None
    api_key: Optional[str] = None
    version: Optional[str] = None
    is_enable: Optional[bool] = None

# Create a new model
@router.post(
    "/",
    summary="Create a new model",
    description="Create a new model associated with a project.",
    status_code=status.HTTP_201_CREATED,
)
def create_model(
    request: CreateModelRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token: missing user ID.",
        )

    new_model = ModelsModel(
        project_id=request.project_id,
        model_type=request.model_type,
        name=request.name,
        api_url=request.api_url,
        api_key=request.api_key,
        version=request.version,
        created_by=user_id,
    )

    db.add(new_model)
    db.commit()
    db.refresh(new_model)

    return standard_response(
        status="success",
        status_code=status.HTTP_201_CREATED,
        message_code="model_created",
        data=new_model,
    )

# Update an existing model
@router.put(
    "/{model_id}",
    summary="Update a model",
    description="Update an existing model by its ID.",
)
def update_model(
    model_id: int,
    request: UpdateModelRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token: missing user ID.",
        )

    model = db.query(ModelsModel).filter(ModelsModel.id == model_id).first()
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model with ID {model_id} not found.",
        )

    if request.project_id:
        project_exists = db.query(ModelsModel).filter(ModelsModel.project_id == request.project_id).first()
        if not project_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Project with ID {request.project_id} does not exist.",
            )

    # Update fields
    for field, value in request.dict(exclude_unset=True).items():
        setattr(model, field, value)
    model.updated_by = user_id
    db.commit()
    db.refresh(model)

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="model_updated",
        data=model,
    )

# Delete a model
@router.delete(
    "/{model_id}",
    summary="Delete a model",
    description="Delete an existing model by its ID.",
)
def delete_model(
    model_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token: missing user ID.",
        )

    model = db.query(ModelsModel).filter(ModelsModel.id == model_id).first()
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model with ID {model_id} not found.",
        )

    db.delete(model)
    db.commit()

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="model_deleted",
        data={"id": model_id},
    )

# Get a model by ID
@router.get(
    "/{model_id}",
    summary="Get a model by ID",
    description="Retrieve a model's details by its ID.",
)
def get_model_by_id(
    model_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token: missing user ID.",
        )

    model = db.query(ModelsModel).filter(ModelsModel.id == model_id).first()
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model with ID {model_id} not found.",
        )

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="model_fetched",
        data=model,
    )

# Get models by project ID
@router.get(
    "/project/{project_id}",
    summary="Get models by project ID",
    description="Retrieve all models associated with a specific project ID.",
)
def get_models_by_project_id(
    project_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token: missing user ID.",
        )

    models = db.query(ModelsModel).filter(ModelsModel.project_id == project_id).all()
    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="models_fetched",
        data=models,
    )

@router.get(
    "/filter",
    summary="Get models by filters",
    description="Retrieve models based on project_id and is_enable status.",
)
def get_models_by_filters(
    project_id: Optional[int] = Query(None, description="Filter by project ID"),
    is_enable: bool = Query(True, description="Filter by enable status"),
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token: missing user ID.",
        )

    # Build query with filters
    query = db.query(ModelsModel)

    if project_id is not None:
        query = query.filter(ModelsModel.project_id == project_id)
    query = query.filter(ModelsModel.is_enable == is_enable)

    models = query.all()

    if not models:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No models found matching the given criteria.",
        )

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="models_filtered",
        data=models,
    )
