from fastapi import APIRouter, HTTPException, Depends, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.config.database import get_db
from app.models.menu.annotations.classes_and_tags_model import ClassesAndTagsModel
from app.utils.response_utils import standard_response
from app.utils.token_bearer_util import JWTBearer
from app.schemas.menu.annotations.classes_and_tags_schema import CreateClassOrTagRequest, UpdateClassOrTagRequest, DeleteClassOrTagRequest


jwt_bearer = JWTBearer()
router = APIRouter()

# Create a new class or tag
@router.post(
    "/",
    summary="Create a new class or tag",
    description="Create a new class or tag with associated project ID.",
    status_code=status.HTTP_201_CREATED,
)
def create_class_or_tag(
    request: CreateClassOrTagRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token: missing user ID.",
        )

    # Check if the tag already exists for the project
    existing_tag = db.query(ClassesAndTagsModel).filter(
        ClassesAndTagsModel.project_id == request.project_id,
        ClassesAndTagsModel.class_name == request.class_name,
    ).first()

    if existing_tag:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tag '{request.class_name}' already exists for project ID {request.project_id}.",
        )

    # Create the new tag
    new_tag = ClassesAndTagsModel(
        project_id=request.project_id,
        class_name=request.class_name,
        class_color=request.class_color,
        created_by=user_id,
    )

    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)

    return standard_response(
        status="success",
        status_code=status.HTTP_201_CREATED,
        message_code="class_or_tag_created",
        data={
            "id": new_tag.id,
            "project_id": new_tag.project_id,
            "class_name": new_tag.class_name,
            "class_color": new_tag.class_color,
            "created_by": new_tag.created_by,
            "created_at": new_tag.created_at,
        },
    )


# Get all classes and tags for a project
@router.get(
    "/{project_id}",
    summary="Get all classes and tags",
    description="Retrieve all classes and tags for a given project ID.",
    status_code=status.HTTP_200_OK,
)
def get_classes_and_tags(
    project_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    """
    Retrieve all classes and tags for a given project ID.

    Args:
        project_id (int): ID of the project to fetch classes and tags for.
        payload (dict): Decoded JWT payload containing user info.
        db (Session): Database session dependency.

    Returns:
        dict: A standardized response containing the list of classes and tags.
    """
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token: missing user ID.",
        )

    # Query the database for classes and tags
    tags = db.query(ClassesAndTagsModel).filter(
        ClassesAndTagsModel.project_id == project_id
    ).all()

    if not tags:
        return standard_response(
            status="error",
            status_code=status.HTTP_404_NOT_FOUND,
            message_code="no_classes_or_tags_found",
            data=f"No classes or tags found for project ID {project_id}.",
        )

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="classes_and_tags_fetched",
        data=tags,
    )

# Update a class or tag
@router.put(
    "/",
    summary="Update a class or tag",
    description="Update a class or tag by its ID.",
    status_code=status.HTTP_200_OK,
)
def update_class_or_tag(
    request: UpdateClassOrTagRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token: missing user ID.",
        )

    # Fetch the tag to update
    tag = db.query(ClassesAndTagsModel).filter(
        ClassesAndTagsModel.id == request.id,
        ClassesAndTagsModel.project_id == request.project_id,
    ).first()

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tag with ID {request.id} and project ID {request.project_id} does not exist.",
        )

    # Update the tag fields
    tag.class_name = request.class_name
    tag.class_color = request.class_color
    tag.tag_name = request.tag_name
    tag.updated_by = user_id

    db.commit()
    db.refresh(tag)

    return standard_response(
        status="success",
        status_code=status.HTTP_200_OK,
        message_code="class_or_tag_updated",
        data={
            "id": tag.id,
            "project_id": tag.project_id,
            "class_name": tag.class_name,
            "class_color": tag.class_color,
            "tag_name": tag.tag_name,
            "updated_by": tag.updated_by,
            "updated_at": tag.updated_at,
        },
    )

@router.delete(
    "/delete",
    summary="Delete a class or tag",
    description="Delete a class or tag by its ID and optionally by project ID.",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_class_or_tag(
    request: DeleteClassOrTagRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token: missing user ID.",
        )

    # Query to fetch the tag
    query = db.query(ClassesAndTagsModel).filter(ClassesAndTagsModel.id == request.class_id)

    if request.project_id is not None:
        query = query.filter(ClassesAndTagsModel.project_id == request.project_id)

    tag = query.first()

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tag with ID {request.class_id} and project ID {request.project_id} does not exist.",
        )

    # Delete the tag
    db.delete(tag)
    db.commit()

    return standard_response(
        status="success",
        status_code=status.HTTP_204_NO_CONTENT,
        message_code="class_or_tag_deleted",
        data={"id": request.class_id, "project_id": request.project_id},
    )