from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.config.database import get_db
from app.models.menu.annotations.annotate_model import AnnotateModel
from app.utils.response_utils import standard_response
from app.utils.token_bearer_util import JWTBearer

router = APIRouter()
jwt_bearer = JWTBearer()

# Request schemas
class CreateAnnotateRequest(BaseModel):
    data_id: int
    annotation: Optional[str] = None
    image: Optional[str] = None

class UpdateAnnotateRequest(BaseModel):
    annotation: Optional[str] = None
    completed: Optional[bool] = None


# CREATE AnnotateModel
@router.post(
    "/",
    summary="Create annotation",
    description="Create a new annotation.",
    status_code=status.HTTP_201_CREATED,
)
def create_annotate(
    request: CreateAnnotateRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    new_annotate = AnnotateModel(
        data_id=request.data_id,
        annotation=request.annotation,
        image=request.image,
        created_by=user_id,
    )
    db.add(new_annotate)
    db.commit()
    db.refresh(new_annotate)

    return standard_response(
        status="success",
        status_code=status.HTTP_201_CREATED,
        message_code="annotation_created",
        data={"annotate_id": new_annotate.id},
    )


# GET AnnotateModel
@router.get(
    "/{annotate_id}",
    summary="Get annotation by ID",
    description="Retrieve an annotation's details.",
)
def get_annotate(
    annotate_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    annotate = db.query(AnnotateModel).filter(AnnotateModel.id == annotate_id).first()
    if not annotate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Annotation with ID {annotate_id} not found.",
        )

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="annotation_fetched",
        data=annotate,
    )


# UPDATE AnnotateModel
@router.put(
    "/{annotate_id}",
    summary="Update annotation",
    description="Update an annotation by ID.",
)
def update_annotate(
    annotate_id: int,
    request: UpdateAnnotateRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    annotate = db.query(AnnotateModel).filter(AnnotateModel.id == annotate_id).first()
    if not annotate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Annotation with ID {annotate_id} not found.",
        )

    for field, value in request.dict(exclude_unset=True).items():
        setattr(annotate, field, value)
    annotate.updated_by = user_id
    db.commit()
    db.refresh(annotate)

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="annotation_updated",
        data=annotate,
    )


# DELETE AnnotateModel
@router.delete(
    "/{annotate_id}",
    summary="Delete annotation",
    description="Delete an annotation by ID.",
)
def delete_annotate(
    annotate_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    annotate = db.query(AnnotateModel).filter(AnnotateModel.id == annotate_id).first()
    if not annotate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Annotation with ID {annotate_id} not found.",
        )

    db.delete(annotate)
    db.commit()

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="annotation_deleted",
        data={"annotate_id": annotate_id},
    )
