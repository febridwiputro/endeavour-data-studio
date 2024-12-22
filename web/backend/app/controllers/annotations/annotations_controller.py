from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models.menu.annotations.annotation_project_model import AnnotationProjectModel
from app.services.annotations_service import (
    get_annotations,
    get_annotation_by_name,
    get_annotations_computer_vision,
)
from app.utils.response_utils import standard_response  # Import the utility
from app.schemas.menu.annotations.annotations_schema import CreateAnnotationProjectRequest
from app.config.database import get_db

router = APIRouter()

@router.post("/", summary="Create New Annotation Project", description="Create a new annotation project.")
def create_annotation_project(request: CreateAnnotationProjectRequest, db: Session = Depends(get_db)):
    """
    Create a new annotation project.

    Args:
        request (CreateAnnotationProjectRequest): The details of the new project.
        db (Session): Database session dependency.

    Returns:
        dict: Response with project details if creation is successful.

    Raises:
        HTTPException: If a project with the same name already exists.
    """
    # Check if the project name already exists
    existing_project = db.query(AnnotationProjectModel).filter(AnnotationProjectModel.name == request.name).first()
    if existing_project:
        raise HTTPException(
            status_code=400,
            detail="A project with the given name already exists.",
        )

    # Create the new project instance
    new_project = AnnotationProjectModel(
        name=request.name,
        description=request.description,
        annotation_type=request.annotation_type,
        project_photo_url=request.project_photo_url,
        menu_id=request.menu_id,
        created_by=request.created_by,
    )

    # Add and commit to the database
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return standard_response(
        status="success",
        status_code=201,
        message_code="annotation_project_created",
        data={
            "id": new_project.id,
            "name": new_project.name,
            "description": new_project.description,
            "annotation_type": new_project.annotation_type,
            "project_photo_url": new_project.project_photo_url,
            "menu_id": new_project.menu_id,
            "created_by": new_project.created_by,
            "created_at": new_project.created_at,
        },
    )

@router.get("/", summary="Get All Annotations", description="Retrieve all annotations data.")
def fetch_annotations():
    """
    Retrieve all annotations data.
    """
    annotations = get_annotations()
    return standard_response(
        status="success",
        status_code=200,
        message_code="annotations_fetched",
        data=annotations,
    )


@router.get("/{annotation_name}", summary="Get Annotation by Name", description="Retrieve a specific annotation by its name.")
def fetch_annotation_by_name(annotation_name: str):
    """
    Retrieve a specific annotation by its name.

    Args:
        annotation_name (str): Name of the annotation.

    Returns:
        dict: The annotation data if found.

    Raises:
        HTTPException: If no annotation with the given name exists.
    """
    annotation = get_annotation_by_name(annotation_name)
    if not annotation:
        return standard_response(
            status="error",
            status_code=404,
            message_code="annotation_not_found",
            data=None,
        )
    return standard_response(
        status="success",
        status_code=200,
        message_code="annotation_fetched",
        data=annotation,
    )


@router.get("/computer_vision/", summary="Get All Computer Vision Annotations", description="Retrieve all computer vision annotations data.")
def fetch_annotations_computer_vision():
    """
    Fetch all computer vision annotations data.
    """
    annotations = get_annotations_computer_vision()
    return standard_response(
        status="success",
        status_code=200,
        message_code="computer_vision_annotations_fetched",
        data=annotations,
    )
