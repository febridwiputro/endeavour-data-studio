from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.config.database import get_db
from app.models.menu.annotations.annotation_project_data_model import AnnotationProjectDataModel
from app.models.menu.annotations.annotate_result_model import VideoAnnotationResultModel
# from app.models.menu.annotations.video_annotation_result_model import VideoAnnotationResultModel
from app.utils.response_utils import standard_response
from app.utils.token_bearer_util import JWTBearer

router = APIRouter()
jwt_bearer = JWTBearer()


class CreateVideoAnnotationRequest(BaseModel):
    data_id: int
    result_type: str
    start_frame: int
    end_frame: int
    label: str
    confidence_score: float


class UpdateVideoAnnotationRequest(BaseModel):
    result_type: Optional[str]
    start_frame: Optional[int]
    end_frame: Optional[int]
    label: Optional[str]
    confidence_score: Optional[float]


@router.post(
    "/",
    summary="Create video annotation",
    description="Create a new video annotation.",
    status_code=status.HTTP_201_CREATED,
)
def create_video_annotation(
    request: CreateVideoAnnotationRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    project_data = db.query(AnnotationProjectDataModel).filter_by(id=request.data_id, data_type="video").first()
    if not project_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video data not found or invalid data type.",
        )

    new_annotation = VideoAnnotationResultModel(
        data_id=request.data_id,
        result_type=request.result_type,
        start_frame=request.start_frame,
        end_frame=request.end_frame,
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
        message_code="video_annotation_created",
        data={"annotation_id": new_annotation.id},
    )


@router.get(
    "/{data_id}",
    summary="Get video annotations by data ID",
    description="Retrieve all annotations for a specific video data ID.",
)
def get_video_annotations(
    data_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    annotations = db.query(VideoAnnotationResultModel).filter_by(data_id=data_id).all()
    if not annotations:
        return standard_response(
            status="error",
            status_code=status.HTTP_404_NOT_FOUND,
            message_code="no_annotations_found",
            data=[],
        )

    response_data = [
        {
            "id": ann.id,
            "result_type": ann.result_type,
            "start_frame": ann.start_frame,
            "end_frame": ann.end_frame,
            "label": ann.label,
            "confidence_score": ann.confidence_score,
        }
        for ann in annotations
    ]

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="annotations_retrieved",
        data=response_data,
    )


@router.put(
    "/{annotation_id}",
    summary="Update video annotation",
    description="Update a video annotation by ID.",
)
def update_video_annotation(
    annotation_id: int,
    request: UpdateVideoAnnotationRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    annotation = db.query(VideoAnnotationResultModel).filter_by(id=annotation_id).first()
    if not annotation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Annotation with ID {annotation_id} not found.",
        )

    for field, value in request.dict(exclude_unset=True).items():
        setattr(annotation, field, value)
    annotation.updated_by = user_id
    db.commit()
    db.refresh(annotation)

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="annotation_updated",
        data=annotation,
    )


@router.delete(
    "/{annotation_id}",
    summary="Delete video annotation",
    description="Delete a video annotation by ID.",
)
def delete_video_annotation(
    annotation_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    annotation = db.query(VideoAnnotationResultModel).filter_by(id=annotation_id).first()
    if not annotation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Annotation with ID {annotation_id} not found.",
        )

    db.delete(annotation)
    db.commit()

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="annotation_deleted",
        data={"annotation_id": annotation_id},
    )
