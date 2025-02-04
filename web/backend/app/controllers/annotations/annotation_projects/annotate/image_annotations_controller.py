from fastapi import APIRouter, HTTPException, Depends, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from pydantic import BaseModel
from typing import List, Optional
from app.config.database import get_db
from app.models.menu.annotations.annotation_project_data_model import AnnotationProjectDataModel
from app.models.menu.annotations.annotate_result_model import ImageAnnotationResultModel
from app.models.menu.annotations.classes_and_tags_model import ClassesAndTagsModel
from app.models.menu.annotations.annotation_project_model import AnnotationProjectModel
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
        label=str(request.label),
        confidence_score=request.confidence_score,
        created_by=user_id,
    )
    db.add(new_annotation)
    annotation_project.is_annotated = True
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

    # 🔹 Try to find annotation by ID
    annotation = db.query(ImageAnnotationResultModel).filter_by(id=annotation_id).first()

    # 🔹 If not found, assume annotation_id might actually be data_id (for bulk delete cases)
    if not annotation:
        annotation = db.query(ImageAnnotationResultModel).filter_by(data_id=annotation_id).first()

    if not annotation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Annotation with ID {annotation_id} not found.",
        )

    # 🔹 Store the data_id before deletion
    data_id = annotation.data_id

    # 🔹 Delete the annotation
    db.delete(annotation)
    db.commit()

    # 🔹 Check if there are any remaining annotations for the same data_id
    remaining_annotations = db.query(ImageAnnotationResultModel).filter_by(data_id=data_id).count()

    if remaining_annotations == 0:
        # ✅ If no annotations remain, set is_annotated=False for the data
        db.query(AnnotationProjectDataModel).filter_by(id=data_id).update({"is_annotated": False})
        db.commit()

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="annotation_deleted",
        data={"annotation_id": annotation_id, "is_annotated": remaining_annotations > 0},
    )

@router.get(
    "/class-count/",
    summary="Get class count by project ID",
    description="Retrieve the count of each class (label) for a given project ID with color information, ordered by count descending.",
    status_code=status.HTTP_200_OK,
)
def get_class_count_by_project(
    project_id: int = Query(..., description="The ID of the project."),
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    # Validate user from payload
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    # Validate if project exists
    project = db.query(AnnotationProjectModel).filter_by(id=project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Annotation project not found.",
        )

    # Query all available classes and join with annotation counts
    class_counts = (
        db.query(
            ClassesAndTagsModel.class_name.label("label"),
            func.coalesce(func.count(ImageAnnotationResultModel.label), 0).label("count"),
            ClassesAndTagsModel.class_color
        )
        .outerjoin(
            ImageAnnotationResultModel,
            (ClassesAndTagsModel.class_name == ImageAnnotationResultModel.label)
            & (ClassesAndTagsModel.project_id == project_id)
        )
        .filter(ClassesAndTagsModel.project_id == project_id)
        .group_by(ClassesAndTagsModel.class_name, ClassesAndTagsModel.class_color)
        .order_by(desc(func.count(ImageAnnotationResultModel.label)))  # Sorting by count descending
        .all()
    )

    # Format response data
    response_data = [
        {"label": label, "count": count, "color": class_color or "#000000"}
        for label, count, class_color in class_counts
    ]

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="class_count_retrieved",
        data=response_data,
    )

@router.get(
    "/annotation-status/",
    summary="Get total annotated and non-annotated data by project ID",
    description="Retrieve the total count of annotated and non-annotated data for a given project ID.",
    status_code=status.HTTP_200_OK,
)
def get_annotation_status(
    project_id: int = Query(..., description="The ID of the project."),
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    project = db.query(AnnotationProjectModel).filter_by(id=project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Annotation project not found.",
        )

    # 🔹 Count all data for the project
    total_data = db.query(func.count(AnnotationProjectDataModel.id)).filter(
        AnnotationProjectDataModel.project_id == project_id
    ).scalar()

    # 🔹 Count annotated data where is_annotated = True
    annotated_data = db.query(func.count(AnnotationProjectDataModel.id)).filter(
        AnnotationProjectDataModel.project_id == project_id,
        AnnotationProjectDataModel.is_annotated == True  # ✅ Updated to use `is_annotated`
    ).scalar()

    # 🔹 Calculate non-annotated data
    non_annotated_data = total_data - annotated_data

    # 🔹 Get last update timestamp from AnnotationProjectDataModel instead of ImageAnnotationResultModel
    last_update = db.query(func.max(AnnotationProjectDataModel.updated_at)).filter(
        AnnotationProjectDataModel.project_id == project_id
    ).scalar()

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="annotation_status_retrieved",
        data={
            "total_data": total_data,
            "annotated_data": annotated_data,
            "non_annotated_data": max(non_annotated_data, 0),  # Prevents negative values
            "last_update": last_update,
        },
    )
