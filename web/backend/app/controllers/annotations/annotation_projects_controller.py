from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.menu.menu_model import MenuModel
from app.models.menu.annotations.annotations_model import (
    AnnotationProjectModel,
    AnnotationFeatureModel,
    SubFeature1Model,
    SubFeature2Model,
    AnnotationProjectFeatureModel,
)
from app.schemas.menu.annotations.annotations_schema import (
    CreateAnnotationProjectRequest,
)
from app.utils.response_utils import standard_response
from app.utils.token_bearer_util import JWTBearer

jwt_bearer = JWTBearer()
router = APIRouter()

# Generic CRUD Functions
def create_item(model, data, db: Session):
    item = model(**data)
    db.add(item)
    db.commit()
    db.refresh(item)
    return standard_response("success", 201, "CREATED", item)

def read_items(model, db: Session):
    items = db.query(model).all()
    return standard_response("success", 200, "FETCHED", items)

def get_by_parameter(model, db: Session, **filters):
    result = db.query(model).filter_by(**filters).all()
    if not result:
        return standard_response(
            status="error",
            status_code=404,
            message_code="NOT_FOUND",
            data=f"No {model.__tablename__} found with the specified parameters."
        )
    return standard_response(
        status="success",
        status_code=200,
        message_code="FETCHED",
        data=result
    )

def update_item(model, item_id, updates, db: Session):
    item = db.query(model).filter(model.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=404, detail=standard_response("error", 404, "NOT_FOUND")
        )
    for key, value in updates.items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return standard_response("success", 200, "UPDATED", item)

def delete_item(model, item_id, db: Session):
    item = db.query(model).filter(model.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=404, detail=standard_response("error", 404, "NOT_FOUND")
        )
    db.delete(item)
    db.commit()
    return standard_response("success", 200, "DELETED", {"id": item_id})


# AnnotationProjectFeatureModel Endpoints
@router.post(
    "/",
    summary="Create New Annotation Project",
    description="Create a new annotation project.",
)
def create_annotation_project(
    request: CreateAnnotationProjectRequest,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    """
    Create a new annotation project.

    Args:
        request (CreateAnnotationProjectRequest): The details of the new project.
        payload (dict): Decoded JWT payload containing user info.
        db (Session): Database session dependency.

    Returns:
        dict: Response with project details if creation is successful.

    Raises:
        HTTPException: If a project with the same name already exists.
    """
    # Extract user ID from the JWT payload
    user_id = payload.get("id")
    # or payload.get("sub")  # Use `sub` as a fallback
    # print("payload======= ", payload)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token: missing user ID or email.",
        )

    # Check if the project name already exists
    existing_project = db.query(AnnotationProjectModel).filter(
        AnnotationProjectModel.name == request.name
    ).first()
    if existing_project:
        raise HTTPException(
            status_code=400,
            detail="A project with the given name already exists.",
        )

    # Validate Sub Feature 2 ID if provided
    if request.sub_feature_2_id:
        sub_feature_2 = db.query(SubFeature2Model).filter(
            SubFeature2Model.id == request.sub_feature_2_id
        ).first()
        if not sub_feature_2:
            raise HTTPException(
                status_code=400,
                detail=f"Sub Feature 2 with ID {request.sub_feature_2_id} does not exist.",
            )

    # Create the new project instance
    new_project = AnnotationProjectModel(
        name=request.name,
        description=request.description,
        project_photo_url=request.project_photo_url,
        sub_feature_2_id=request.sub_feature_2_id,
        created_by=user_id,  # Automatically set created_by from JWT payload
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
            "project_photo_url": new_project.project_photo_url,
            "sub_feature_2_id": new_project.sub_feature_2_id,
            "created_by": new_project.created_by,
            "created_at": new_project.created_at,
        },
    )

@router.delete(
    "/{project_id}",
    summary="Delete Annotation Project",
    description="Delete an existing annotation project by ID.",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_annotation_project(
    project_id: int,
    payload: dict = Depends(jwt_bearer),
    db: Session = Depends(get_db),
):
    """
    Delete an annotation project by ID.

    Args:
        project_id (int): The ID of the project to delete.
        payload (dict): Decoded JWT payload containing user info.
        db (Session): Database session dependency.

    Returns:
        dict: Success message if the deletion is successful.

    Raises:
        HTTPException: If the project does not exist or the user is unauthorized.
    """
    # Extract user ID from the JWT payload
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token: missing user ID.",
        )

    # Fetch the project from the database
    project = db.query(AnnotationProjectModel).filter(
        AnnotationProjectModel.id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Annotation project with ID {project_id} does not exist.",
        )

    # Optional: Verify if the user has permission to delete the project
    if project.created_by != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this project.",
        )

    # Delete the project
    db.delete(project)
    db.commit()

    return standard_response(
        status="success",
        status_code=status.HTTP_204_NO_CONTENT,
        message_code="annotation_project_deleted",
        data={"id": project_id},
    )


# AnnotationProjectModel Endpoints
@router.post("/ ")
def create_annotation_project(data: dict, db: Session = Depends(get_db)):
    return create_item(AnnotationProjectModel, data, db)

@router.get("/")
def read_annotation_projects(db: Session = Depends(get_db)):
    return read_items(AnnotationProjectModel, db)

@router.put("/{project_id}")
def update_annotation_project(project_id: int, updates: dict, db: Session = Depends(get_db)):
    return update_item(AnnotationProjectModel, project_id, updates, db)

# @router.delete("/{project_id}")
# def delete_annotation_project(project_id: int, db: Session = Depends(get_db)):
#     return delete_item(AnnotationProjectModel, project_id, db)

@router.get("/by-feature-code/{annotation_feature_code_name}")
def get_annotation_projects_by_feature_code(annotation_feature_code_name: str, db: Session = Depends(get_db)):
    """
    Get Annotation Projects by Annotation Feature Code Name
    """
    # Get annotation feature ID by code_name
    annotation_feature = (
        db.query(AnnotationFeatureModel.id)
        .filter(AnnotationFeatureModel.code_name == annotation_feature_code_name)
        .first()
    )
    if not annotation_feature:
        raise HTTPException(
            status_code=404, detail=f"Annotation feature with code_name '{annotation_feature_code_name}' not found."
        )

    annotation_feature_id = annotation_feature.id

    # Get sub_feature_1 IDs associated with the annotation feature
    sub_feature_1_ids = db.query(SubFeature1Model.id).filter(
        SubFeature1Model.feature_id == annotation_feature_id
    ).all()

    # Flatten the list of sub_feature_1_ids
    sub_feature_1_ids = [sf1.id for sf1 in sub_feature_1_ids]

    if not sub_feature_1_ids:
        return standard_response("success", 200, "NO_PROJECTS_FOUND", [])

    # Get sub_feature_2 IDs associated with sub_feature_1
    sub_feature_2_ids = db.query(SubFeature2Model.id).filter(
        SubFeature2Model.sub_feature_1_id.in_(sub_feature_1_ids)
    ).all()

    # Flatten the list of sub_feature_2_ids
    sub_feature_2_ids = [sf2.id for sf2 in sub_feature_2_ids]

    if not sub_feature_2_ids:
        return standard_response("success", 200, "NO_PROJECTS_FOUND", [])

    # Get projects associated with sub_feature_2
    projects = db.query(AnnotationProjectModel).filter(
        AnnotationProjectModel.sub_feature_2_id.in_(sub_feature_2_ids)
    ).all()

    # Return projects as a standard response
    return standard_response("success", 200, "PROJECTS_FOUND", projects)

# AnnotationProjectModel
@router.get("/by-name/{name}")
def get_project_by_name(name: str, db: Session = Depends(get_db)):
    result = get_by_parameter(AnnotationProjectModel, db, name=name)
    return standard_response("success", 200, "PROJECT_FOUND", result)

@router.get("/by-feature/{annotation_feature_id}")
def get_project_by_feature(annotation_feature_id: int, db: Session = Depends(get_db)):
    result = get_by_parameter(AnnotationProjectModel, db, annotation_feature_id=annotation_feature_id)
    return standard_response("success", 200, "PROJECT_FOUND", result)

@router.get("/by-creator/{created_by}")
def get_project_by_creator(created_by: int, db: Session = Depends(get_db)):
    result = get_by_parameter(AnnotationProjectModel, db, created_by=created_by)
    return standard_response("success", 200, "PROJECT_FOUND", result)