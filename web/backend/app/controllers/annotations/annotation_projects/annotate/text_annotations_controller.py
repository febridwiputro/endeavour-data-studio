from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.config.database import get_db
from app.models.menu.annotations.annotation_project_data_model import AnnotationProjectDataModel
from app.models.menu.annotations.annotate_result_model import TextAnnotationResultModel
# from app.models.menu.annotations.text_annotation_result_model import TextAnnotationResultModel
from app.utils.response_utils import standard_response
from app.utils.token_bearer_util import JWTBearer

router = APIRouter()
jwt_bearer = JWTBearer()


# Request schemas
class CreateTextAnnotationRequest(BaseModel):
    data_id: int
    text_result: str
    label: Optional[str] = None
    confidence_score: Optional[float] = None


class UpdateTextAnnotationRequest(BaseModel):
    text_result: Optional[str]
    label: Optional[str]
    confidence_score: Optional[float]


# CREATE TextAnnotationResultModel
@router.post(
    "/",
    summary="Create text annotation",
    description="Create a new text annotation.",
    status_code=status.HTTP_201_CREATED,
)
def create_text_annotation(
    request: CreateTextAnnotationRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    project_data = db.query(AnnotationProjectDataModel).filter_by(id=request.data_id, data_type="text").first()
    if not project_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Text data not found or invalid data type.",
        )

    new_annotation = TextAnnotationResultModel(
        data_id=request.data_id,
        text_result=request.text_result,
        label=request.label,
        confidence_score=request.confidence_score,
        created_by=user_id,
    )
    db.add(new_annotation)
    db.commit()
    db.refresh(new_annotation)

    return standard_response(
        status="success",
        status_code=status.HTTP_201_CREATED,
        message_code="text_annotation_created",
        data={"annotation_id": new_annotation.id},
    )


# GET TextAnnotationResultModel by data ID
@router.get(
    "/{data_id}",
    summary="Get text annotations by data ID",
    description="Retrieve all text annotations for a specific data ID.",
)
def get_text_annotations(
    data_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    annotations = db.query(TextAnnotationResultModel).filter_by(data_id=data_id).all()
    if not annotations:
        return standard_response(
            status="error",
            status_code=status.HTTP_404_NOT_FOUND,
            message_code="no_text_annotations_found",
            data=[],
        )

    response_data = [
        {
            "id": ann.id,
            "text_result": ann.text_result,
            "label": ann.label,
            "confidence_score": ann.confidence_score,
        }
        for ann in annotations
    ]

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="text_annotations_retrieved",
        data=response_data,
    )


# UPDATE TextAnnotationResultModel
@router.put(
    "/{annotation_id}",
    summary="Update text annotation",
    description="Update a text annotation by ID.",
)
def update_text_annotation(
    annotation_id: int,
    request: UpdateTextAnnotationRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    annotation = db.query(TextAnnotationResultModel).filter_by(id=annotation_id).first()
    if not annotation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Text annotation with ID {annotation_id} not found.",
        )

    for field, value in request.dict(exclude_unset=True).items():
        setattr(annotation, field, value)
    annotation.updated_by = user_id
    db.commit()
    db.refresh(annotation)

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="text_annotation_updated",
        data=annotation,
    )


# DELETE TextAnnotationResultModel
@router.delete(
    "/{annotation_id}",
    summary="Delete text annotation",
    description="Delete a text annotation by ID.",
)
def delete_text_annotation(
    annotation_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    annotation = db.query(TextAnnotationResultModel).filter_by(id=annotation_id).first()
    if not annotation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Text annotation with ID {annotation_id} not found.",
        )

    db.delete(annotation)
    db.commit()

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="text_annotation_deleted",
        data={"annotation_id": annotation_id},
    )
