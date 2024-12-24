from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.models.menu.menus_model import (
    AnnotationProjectModel,
    AnnotationTypeModel,
    MenuModel,
)
from app.services.annotations_service import (
    get_annotations,
    get_annotation_by_name,
    get_annotations_computer_vision,
)
from app.enums.annotation_type_enum import AnnotationType
from app.utils.response_utils import standard_response
from app.schemas.menu.annotations.annotations_schema import (
    CreateAnnotationProjectRequest,
)
from app.config.database import get_db

router = APIRouter()


@router.post(
    "/",
    summary="Create New Annotation Project",
    description="Create a new annotation project.",
)
def create_annotation_project(
    request: CreateAnnotationProjectRequest, db: Session = Depends(get_db)
):
    """
    Create a new annotation project.

    Args:
        request (CreateAnnotationProjectRequest): The details of the new project.
        db (Session): Database session dependency.

    Returns:
        dict: Response with project details if creation is successful.

    Raises:
        HTTPException: If a project with the same name already exists or if the annotation type is invalid.
    """
    # Check if the project name already exists
    existing_project = (
        db.query(AnnotationProjectModel)
        .filter(AnnotationProjectModel.name == request.name)
        .first()
    )
    if existing_project:
        raise HTTPException(
            status_code=400,
            detail="A project with the given name already exists.",
        )

    # Fetch the annotation type ID by code_name
    annotation_type = (
        db.query(AnnotationTypeModel)
        .filter(AnnotationTypeModel.code_name == request.annotation_type)
        .first()
    )
    if not annotation_type:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid annotation type: {request.annotation_type}.",
        )

    # Validate menu existence
    menu = db.query(MenuModel).filter(MenuModel.id == request.menu_id).first()
    if not menu:
        raise HTTPException(
            status_code=400,
            detail=f"Menu with ID {request.menu_id} does not exist.",
        )

    # Create the new project instance
    new_project = AnnotationProjectModel(
        name=request.name,
        description=request.description,
        annotation_type_id=annotation_type.id,  # Use the fetched ID
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
            "annotation_type": annotation_type.name,
            "project_photo_url": new_project.project_photo_url,
            "menu_id": new_project.menu_id,
            "created_by": new_project.created_by,
            "created_at": new_project.created_at,
        },
    )


# @router.post(
#     "/",
#     summary="Create New Annotation Project",
#     description="Create a new annotation project.",
# )
# def create_annotation_project(
#     request: CreateAnnotationProjectRequest, db: Session = Depends(get_db)
# ):
#     """
#     Create a new annotation project.

#     Args:
#         request (CreateAnnotationProjectRequest): The details of the new project.
#         db (Session): Database session dependency.

#     Returns:
#         dict: Response with project details if creation is successful.

#     Raises:
#         HTTPException: If a project with the same name already exists or if the annotation type is invalid.
#     """
#     # Check if the project name already exists
#     existing_project = (
#         db.query(AnnotationProjectModel)
#         .filter(AnnotationProjectModel.name == request.name)
#         .first()
#     )
#     if existing_project:
#         raise HTTPException(
#             status_code=400,
#             detail="A project with the given name already exists.",
#         )

#     # Validate the provided annotation_type
#     annotation_type = (
#         db.query(AnnotationTypeModel)
#         .filter(AnnotationTypeModel.code_name == request.annotation_type)
#         .first()
#     )
#     if not annotation_type:
#         raise HTTPException(
#             status_code=400,
#             detail=f"Invalid annotation type: {request.annotation_type}.",
#         )

#     # Validate menu existence
#     menu = db.query(MenuModel).filter(MenuModel.id == request.menu_id).first()
#     if not menu:
#         raise HTTPException(
#             status_code=400,
#             detail=f"Menu with ID {request.menu_id} does not exist.",
#         )

#     # Create the new project instance
#     new_project = AnnotationProjectModel(
#         name=request.name,
#         description=request.description,
#         annotation_type_id=annotation_type.id,
#         project_photo_url=request.project_photo_url,
#         menu_id=request.menu_id,
#         created_by=request.created_by,
#     )

#     # Add and commit to the database
#     db.add(new_project)
#     db.commit()
#     db.refresh(new_project)

#     return standard_response(
#         status="success",
#         status_code=201,
#         message_code="annotation_project_created",
#         data={
#             "id": new_project.id,
#             "name": new_project.name,
#             "description": new_project.description,
#             "annotation_type": annotation_type.name,
#             "project_photo_url": new_project.project_photo_url,
#             "menu_id": new_project.menu_id,
#             "created_by": new_project.created_by,
#             "created_at": new_project.created_at,
#         },
#     )


@router.get(
    "/annotations",
    summary="Get All Annotations",
    description="Retrieve a list of all annotation projects.",
)
def get_annotations_list(db: Session = Depends(get_db)):
    """
    Get a list of all annotation projects.

    Args:
        db (Session): Database session dependency.

    Returns:
        dict: List of annotation projects.
    """
    # Query all annotation projects
    annotations = db.query(AnnotationProjectModel).all()

    # Format response
    return standard_response(
        status="success",
        status_code=200,
        message_code="annotations_retrieved",
        data=[
            {
                "id": annotation.id,
                "name": annotation.name,
                "description": annotation.description,
                "annotation_type": annotation.annotation_type,
                "menu_id": annotation.menu_id,
                "created_by": annotation.created_by,
                "created_at": annotation.created_at,
            }
            for annotation in annotations
        ],
    )


@router.get(
    "/types",
    summary="Get Annotation Types",
    description="Retrieve all available annotation types.",
)
def get_annotation_types(db: Session = Depends(get_db)):
    """
    Get all annotation types from the database.

    Args:
        db (Session): The database session.

    Returns:
        dict: List of annotation types.
    """
    # Retrieve all annotation types from the database
    annotation_types = db.query(AnnotationTypeModel).filter_by(is_active=True).all()

    # Format response data
    data = [
        # annotation_type.code_name
        {
            "id": annotation_type.id,
            "name": annotation_type.name,
            "code_name": annotation_type.code_name,
            "description": annotation_type.description,
            "logo_url": annotation_type.logo_url,
        }
        for annotation_type in annotation_types
    ]

    # Return standardized response
    return standard_response(
        status="success",
        status_code=200,
        message_code="annotation_types_retrieved",
        data=data,
    )

@router.get(
    "/type/{annotation_type}",
    summary="Get Annotations by Type",
    description="Retrieve annotations by their type.",
)
def get_annotations_by_type(annotation_type: str, db: Session = Depends(get_db)):
    """
    Get annotations filtered by their type.

    Args:
        annotation_type (str): The type of annotation to filter.
        db (Session): Database session dependency.

    Returns:
        dict: List of annotations matching the type.

    Raises:
        HTTPException: If no annotations are found for the specified type.
    """
    # Retrieve the annotation type ID from the database
    annotation_type_entry = (
        db.query(AnnotationTypeModel)
        .filter(AnnotationTypeModel.code_name == annotation_type)
        .first()
    )

    if not annotation_type_entry:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid annotation type: {annotation_type}",
        )

    # Query annotations by type ID
    annotations = (
        db.query(AnnotationProjectModel)
        .filter(AnnotationProjectModel.annotation_type_id == annotation_type_entry.id)
        .all()
    )

    if not annotations:
        raise HTTPException(
            status_code=404,
            detail=f"No annotations found for type '{annotation_type}'.",
        )

    # Format response
    return standard_response(
        status="success",
        status_code=200,
        message_code="annotations_by_type_retrieved",
        data=[
            {
                "id": annotation.id,
                "name": annotation.name,
                "description": annotation.description,
                "project_photo_url": annotation.project_photo_url,
                "annotation_type": annotation_type_entry.name,  # Use human-readable name
                "menu_id": annotation.menu_id,
                "created_by": annotation.created_by,
                "created_at": annotation.created_at,
            }
            for annotation in annotations
        ],
    )


# @router.get(
#     "/type/{annotation_type}",
#     summary="Get Annotations by Type",
#     description="Retrieve annotations by their type.",
# )
# def get_annotations_by_type(annotation_type: str, db: Session = Depends(get_db)):
#     """
#     Get annotations filtered by their type.

#     Args:
#         annotation_type (str): The type of annotation to filter.
#         db (Session): Database session dependency.

#     Returns:
#         dict: List of annotations matching the type.

#     Raises:
#         HTTPException: If no annotations are found for the specified type.
#     """
#     # Query annotations by type
#     annotations = (
#         db.query(AnnotationProjectModel)
#         .filter(AnnotationProjectModel.annotation_type_id == annotation_type)
#         .all()
#     )

#     if not annotations:
#         raise HTTPException(
#             status_code=404,
#             detail=f"No annotations found for type '{annotation_type}'.",
#         )

#     # Format response
#     return standard_response(
#         status="success",
#         status_code=200,
#         message_code="annotations_by_type_retrieved",
#         data=[
#             {
#                 "id": annotation.id,
#                 "name": annotation.name,
#                 "description": annotation.description,
#                 "project_photo_url": annotation.project_photo_url,
#                 "annotation_type": annotation.annotation_type,
#                 "menu_id": annotation.menu_id,
#                 "created_by": annotation.created_by,
#                 "created_at": annotation.created_at,
#             }
#             for annotation in annotations
#         ],
#     )


@router.get(
    "/", summary="Get All Annotations", description="Retrieve all annotations data."
)
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


@router.get(
    "/{annotation_name}",
    summary="Get Annotation by Name",
    description="Retrieve a specific annotation by its name.",
)
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


@router.get(
    "/computer_vision/",
    summary="Get All Computer Vision Annotations",
    description="Retrieve all computer vision annotations data.",
)
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
