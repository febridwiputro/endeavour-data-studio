from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.config.database import get_db
from app.models.menu.annotations.annotate_result_model import AnnotateResultModel
from app.utils.response_utils import standard_response
from app.utils.token_bearer_util import JWTBearer

router = APIRouter()
jwt_bearer = JWTBearer()

# Request schemas
class CreateAnnotateResultRequest(BaseModel):
    annotate_id: int
    result_type: str
    x1: Optional[int] = None
    y1: Optional[int] = None
    x2: Optional[int] = None
    y2: Optional[int] = None
    text_result: Optional[str] = None
    label: Optional[str] = None
    confidence_score: Optional[float] = None


class UpdateAnnotateResultRequest(BaseModel):
    result_type: Optional[str] = None
    x1: Optional[int] = None
    y1: Optional[int] = None
    x2: Optional[int] = None
    y2: Optional[int] = None
    text_result: Optional[str] = None
    label: Optional[str] = None
    confidence_score: Optional[float] = None


# CREATE AnnotateResultModel
@router.post(
    "/",
    summary="Create annotation result",
    description="Create a new annotation result.",
    status_code=status.HTTP_201_CREATED,
)
def create_annotate_result(
    request: CreateAnnotateResultRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    new_result = AnnotateResultModel(
        annotate_id=request.annotate_id,
        result_type=request.result_type,
        x1=request.x1,
        y1=request.y1,
        x2=request.x2,
        y2=request.y2,
        text_result=request.text_result,
        label=request.label,
        confidence_score=request.confidence_score,
        created_by=user_id,
    )
    db.add(new_result)
    db.commit()
    db.refresh(new_result)

    return standard_response(
        status="success",
        status_code=status.HTTP_201_CREATED,
        message_code="annotation_result_created",
        data=new_result,
    )


# GET AnnotateResultModel
@router.get(
    "/{result_id}",
    summary="Get annotation result by ID",
    description="Retrieve an annotation result's details by ID.",
)
def get_annotate_result(
    result_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    result = db.query(AnnotateResultModel).filter(AnnotateResultModel.id == result_id).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Annotation result with ID {result_id} not found.",
        )

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="annotation_result_fetched",
        data=result,
    )


# UPDATE AnnotateResultModel
@router.put(
    "/{result_id}",
    summary="Update annotation result",
    description="Update an annotation result by ID.",
)
def update_annotate_result(
    result_id: int,
    request: UpdateAnnotateResultRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    result = db.query(AnnotateResultModel).filter(AnnotateResultModel.id == result_id).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Annotation result with ID {result_id} not found.",
        )

    for field, value in request.dict(exclude_unset=True).items():
        setattr(result, field, value)
    result.updated_by = user_id
    db.commit()
    db.refresh(result)

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="annotation_result_updated",
       
        data=result,
    )


# DELETE AnnotateResultModel
@router.delete(
    "/{result_id}",
    summary="Delete annotation result",
    description="Delete an annotation result by ID.",
)
def delete_annotate_result(
    result_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token."
        )

    result = db.query(AnnotateResultModel).filter(AnnotateResultModel.id == result_id).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Annotation result with ID {result_id} not found.",
        )

    db.delete(result)
    db.commit()

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="annotation_result_deleted",
        data={"result_id": result_id},
    )
