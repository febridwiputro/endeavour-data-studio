from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.config.database import get_db
from app.models.menu.annotations.annotation_project_data_model import AnnotationProjectDataModel
from app.models.menu.annotations.annotate_result_model import ImageAnnotationResultModel
# from app.models.menu.annotations.image_annotation_result_model import ImageAnnotationResultModel
from app.utils.response_utils import standard_response
from app.utils.token_bearer_util import JWTBearer

router = APIRouter()
jwt_bearer = JWTBearer()


class CreateImageAnnotationRequest(BaseModel):
    data_id: int
    result_type: str
    x1: float
    y1: float
    x2: float
    y2: float
    label: str
    confidence_score: float

class UpdateImageAnnotationRequest(BaseModel):
    data_id: Optional[int]
    x1: Optional[float]
    y1: Optional[float]
    x2: Optional[float]
    y2: Optional[float]
    label: Optional[str]
    confidence_score: Optional[float]

@router.post(
    "/",
    summary="Create image annotation",
    description="Create a new image annotation.",
    status_code=status.HTTP_201_CREATED,
)
def create_image_annotation(
    request: CreateImageAnnotationRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    # Validasi bahwa annotate_id terkait dengan data
    annotation_project = db.query(AnnotationProjectDataModel).filter_by(id=request.data_id).first()
    if not annotation_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Annotation project not found.",
        )

    new_annotation = ImageAnnotationResultModel(
        data_id=request.data_id,
        result_type=request.result_type,
        x1=request.x1,
        y1=request.y1,
        x2=request.x2,
        y2=request.y2,
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
        message_code="image_annotation_created",
        data={"annotation_id": new_annotation.id},
    )



@router.get(
    "/{data_id}",
    summary="Get image annotations by data ID",
    description="Retrieve all annotations for a specific image data ID.",
)
def get_image_annotations(
    data_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    annotations = db.query(ImageAnnotationResultModel).filter_by(data_id=data_id).all()
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
            "x1": ann.x1,
            "y1": ann.y1,
            "x2": ann.x2,
            "y2": ann.y2,
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
    summary="Update image annotation",
    description="Update an image annotation by ID.",
)
def update_image_annotation(
    annotation_id: int,
    request: UpdateImageAnnotationRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    annotation = db.query(ImageAnnotationResultModel).filter_by(id=annotation_id).first()
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
        data={
            "annotation_id": annotation.id,
            "data_id": annotation.data_id,
        },
    )



@router.delete(
    "/{annotation_id}",
    summary="Delete image annotation",
    description="Delete an image annotation by ID.",
)
def delete_image_annotation(
    annotation_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    # Coba cari berdasarkan annotation_id
    annotation = db.query(ImageAnnotationResultModel).filter_by(id=annotation_id).first()

    # Jika annotation_id tidak ditemukan, cari berdasarkan data_id dan properti bounding box
    if not annotation:
        annotation = (
            db.query(ImageAnnotationResultModel)
            .filter_by(
                data_id=annotation_id,  # Assuming data_id was passed instead of annotation_id
            )
            .first()
        )

    if not annotation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Annotation with ID {annotation_id} or matching bounding box not found.",
        )

    db.delete(annotation)
    db.commit()

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="annotation_deleted",
        data={"annotation_id": annotation_id},
    )


# @router.put(
#     "/{annotation_id}",
#     summary="Update image annotation",
#     description="Update an image annotation by ID.",
# )
# def update_image_annotation(
#     annotation_id: int,
#     request: UpdateImageAnnotationRequest,
#     payload: dict = Depends(jwt_bearer),
#     db: Session = Depends(get_db),
# ):
#     user_id = payload.get("id")
#     if not user_id:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
#         )

#     annotation = db.query(ImageAnnotationResultModel).filter_by(id=annotation_id).first()
#     if not annotation:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail=f"Annotation with ID {annotation_id} not found.",
#         )

#     for field, value in request.dict(exclude_unset=True).items():
#         setattr(annotation, field, value)
#     annotation.updated_by = user_id
#     db.commit()
#     db.refresh(annotation)

#     return standard_response(
#         status="success",
#         status_code=status.HTTP_200_OK,
#         message_code="annotation_updated",
#         data=annotation,
#     )


# @router.delete(
#     "/{annotation_id}",
#     summary="Delete image annotation",
#     description="Delete an image annotation by ID.",
# )
# def delete_image_annotation(
#     annotation_id: int,
#     payload: dict = Depends(jwt_bearer),
#     db: Session = Depends(get_db),
# ):
#     user_id = payload.get("id")
#     if not user_id:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
#         )

#     annotation = db.query(ImageAnnotationResultModel).filter_by(id=annotation_id).first()
#     if not annotation:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail=f"Annotation with ID {annotation_id} not found.",
#         )

#     db.delete(annotation)
#     db.commit()

#     return standard_response(
#         status="success",
#         status_code=status.HTTP_200_OK,
#         message_code="annotation_deleted",
#         data={"annotation_id": annotation_id},
#     )
