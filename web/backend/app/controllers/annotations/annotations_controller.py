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

# AnnotationFeatureModel Endpoints
@router.post("/annotation-features")
def create_annotation_feature(data: dict, db: Session = Depends(get_db)):
    return create_item(AnnotationFeatureModel, data, db)

@router.get("/annotation-features")
def read_annotation_features(db: Session = Depends(get_db)):
    return read_items(AnnotationFeatureModel, db)

@router.put("/annotation-features/{feature_id}")
def update_annotation_feature(feature_id: int, updates: dict, db: Session = Depends(get_db)):
    return update_item(AnnotationFeatureModel, feature_id, updates, db)

@router.delete("/annotation-features/{feature_id}")
def delete_annotation_feature(feature_id: int, db: Session = Depends(get_db)):
    return delete_item(AnnotationFeatureModel, feature_id, db)

# SubFeature1Model Endpoints
@router.post("/sub-features-1")
def create_sub_feature_1(data: dict, db: Session = Depends(get_db)):
    return create_item(SubFeature1Model, data, db)

@router.get("/sub-features-1")
def read_sub_features_1(db: Session = Depends(get_db)):
    return read_items(SubFeature1Model, db)

@router.put("/sub-features-1/{sub_feature_id}")
def update_sub_feature_1(sub_feature_id: int, updates: dict, db: Session = Depends(get_db)):
    return update_item(SubFeature1Model, sub_feature_id, updates, db)

@router.delete("/sub-features-1/{sub_feature_id}")
def delete_sub_feature_1(sub_feature_id: int, db: Session = Depends(get_db)):
    return delete_item(SubFeature1Model, sub_feature_id, db)

# SubFeature2Model Endpoints
@router.post("/sub-features-2")
def create_sub_feature_2(data: dict, db: Session = Depends(get_db)):
    return create_item(SubFeature2Model, data, db)

@router.get("/sub-features-2")
def read_sub_features_2(db: Session = Depends(get_db)):
    return read_items(SubFeature2Model, db)

@router.put("/sub-features-2/{sub_feature_id}")
def update_sub_feature_2(sub_feature_id: int, updates: dict, db: Session = Depends(get_db)):
    return update_item(SubFeature2Model, sub_feature_id, updates, db)

@router.delete("/sub-features-2/{sub_feature_id}")
def delete_sub_feature_2(sub_feature_id: int, db: Session = Depends(get_db)):
    return delete_item(SubFeature2Model, sub_feature_id, db)

# AnnotationProjectFeatureModel Endpoints
@router.post(
    "/annotation-project",
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
    "/annotation-project/{project_id}",
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


# @router.post("/annotation-project-features")
# def create_annotation_project_feature(data: dict, db: Session = Depends(get_db)):
#     return create_item(AnnotationProjectFeatureModel, data, db)

@router.get("/annotation-project-features")
def read_annotation_project_features(db: Session = Depends(get_db)):
    return read_items(AnnotationProjectFeatureModel, db)

@router.put("/annotation-project-features/{feature_id}")
def update_annotation_project_feature(feature_id: int, updates: dict, db: Session = Depends(get_db)):
    return update_item(AnnotationProjectFeatureModel, feature_id, updates, db)

@router.delete("/annotation-project-features/{feature_id}")
def delete_annotation_project_feature(feature_id: int, db: Session = Depends(get_db)):
    return delete_item(AnnotationProjectFeatureModel, feature_id, db)

# AnnotationProjectModel Endpoints
@router.post("/annotation-projects")
def create_annotation_project(data: dict, db: Session = Depends(get_db)):
    return create_item(AnnotationProjectModel, data, db)

@router.get("/annotation-projects")
def read_annotation_projects(db: Session = Depends(get_db)):
    return read_items(AnnotationProjectModel, db)

@router.put("/annotation-projects/{project_id}")
def update_annotation_project(project_id: int, updates: dict, db: Session = Depends(get_db)):
    return update_item(AnnotationProjectModel, project_id, updates, db)

@router.delete("/annotation-projects/{project_id}")
def delete_annotation_project(project_id: int, db: Session = Depends(get_db)):
    return delete_item(AnnotationProjectModel, project_id, db)

@router.get("/annotations/annotation-projects/by-feature-code/{annotation_feature_code_name}")
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

# AnnotationFeatureModel
@router.get("/feature/by-name/{name}")
def get_feature_by_name(name: str, db: Session = Depends(get_db)):
    result = get_by_parameter(AnnotationFeatureModel, db, name=name)
    return standard_response("success", 200, "FEATURE_FOUND", result)

@router.get("/feature/by-menu/{menu_id}")
def get_feature_by_menu(menu_id: int, db: Session = Depends(get_db)):
    result = get_by_parameter(AnnotationFeatureModel, db, menu_id=menu_id)
    return standard_response("success", 200, "FEATURE_FOUND", result)


@router.get("/feature/by-status/{is_active}")
def get_feature_by_status(is_active: bool, db: Session = Depends(get_db)):
    result = get_by_parameter(AnnotationFeatureModel, db, is_active=is_active)
    return standard_response("success", 200, "FEATURE_FOUND", result)

# SubFeature1Model
@router.get("/sub-feature1/by-name/{name}")
def get_sub_feature1_by_name(name: str, db: Session = Depends(get_db)):
    result = get_by_parameter(SubFeature1Model, db, name=name)
    return standard_response("success", 200, "SUB_FEATURE1_FOUND", result)

@router.get("/sub-feature1/by-feature/{feature_id}")
def get_sub_feature1_by_feature(feature_id: int, db: Session = Depends(get_db)):
    return get_by_parameter(SubFeature1Model, db, feature_id=feature_id)

@router.get("/sub-feature1/by-creator/{created_by}")
def get_sub_feature1_by_creator(created_by: int, db: Session = Depends(get_db)):
    result = get_by_parameter(SubFeature1Model, db, created_by=created_by)
    return standard_response("success", 200, "SUB_FEATURE1_FOUND", result)

# SubFeature2Model
@router.get("/sub-feature2/by-name/{name}")
def get_sub_feature2_by_name(name: str, db: Session = Depends(get_db)):
    result = get_by_parameter(SubFeature2Model, db, name=name)
    return standard_response("success", 200, "SUB_FEATURE2_FOUND", result)

@router.get("/sub-feature2/by-sub-feature1/{sub_feature_1_id}")
def get_sub_feature2_by_sub_feature1(sub_feature_1_id: int, db: Session = Depends(get_db)):
    return get_by_parameter(SubFeature2Model, db, sub_feature_1_id=sub_feature_1_id)


@router.get("/sub-feature2/by-creator/{created_by}")
def get_sub_feature2_by_creator(created_by: int, db: Session = Depends(get_db)):
    result = get_by_parameter(SubFeature2Model, db, created_by=created_by)
    return standard_response("success", 200, "SUB_FEATURE2_FOUND", result)

# AnnotationProjectModel
@router.get("/project/by-name/{name}")
def get_project_by_name(name: str, db: Session = Depends(get_db)):
    result = get_by_parameter(AnnotationProjectModel, db, name=name)
    return standard_response("success", 200, "PROJECT_FOUND", result)

@router.get("/project/by-feature/{annotation_feature_id}")
def get_project_by_feature(annotation_feature_id: int, db: Session = Depends(get_db)):
    result = get_by_parameter(AnnotationProjectModel, db, annotation_feature_id=annotation_feature_id)
    return standard_response("success", 200, "PROJECT_FOUND", result)

@router.get("/project/by-creator/{created_by}")
def get_project_by_creator(created_by: int, db: Session = Depends(get_db)):
    result = get_by_parameter(AnnotationProjectModel, db, created_by=created_by)
    return standard_response("success", 200, "PROJECT_FOUND", result)








# from fastapi import APIRouter, HTTPException, Depends
# from sqlalchemy.orm import Session
# from app.models.menu.menus_model import (
#     AnnotationProjectModel,
#     # AnnotationTypeModel,
#     MenuModel,
#     AnnotationFeatureModel
# )
# from app.services.annotations_service import (
#     get_annotations,
#     get_annotation_by_name,
#     get_annotations_computer_vision,
# )
# from app.enums.annotation_type_enum import AnnotationType
# from app.utils.response_utils import standard_response
# from app.schemas.menu.annotations.annotations_schema import (
#     CreateAnnotationProjectRequest,
# )
# from app.config.database import get_db

# router = APIRouter()


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

#     # Fetch the annotation type ID by code_name
#     annotation_type = (
#         db.query(AnnotationFeatureModel)
#         .filter(AnnotationFeatureModel.code_name == request.annotation_type)
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
#         annotation_type_id=annotation_type.id,  # Use the fetched ID
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


# @router.get(
#     "/annotations",
#     summary="Get All Annotations",
#     description="Retrieve a list of all annotation projects.",
# )
# def get_annotations_list(db: Session = Depends(get_db)):
#     """
#     Get a list of all annotation projects.

#     Args:
#         db (Session): Database session dependency.

#     Returns:
#         dict: List of annotation projects.
#     """
#     # Query all annotation projects
#     annotations = db.query(AnnotationProjectModel).all()

#     # Format response
#     return standard_response(
#         status="success",
#         status_code=200,
#         message_code="annotations_retrieved",
#         data=[
#             {
#                 "id": annotation.id,
#                 "name": annotation.name,
#                 "description": annotation.description,
#                 "annotation_type": annotation.annotation_type,
#                 "menu_id": annotation.menu_id,
#                 "created_by": annotation.created_by,
#                 "created_at": annotation.created_at,
#             }
#             for annotation in annotations
#         ],
#     )


# @router.get(
#     "/types",
#     summary="Get Annotation Types",
#     description="Retrieve all available annotation types.",
# )
# def get_annotation_types(db: Session = Depends(get_db)):
#     """
#     Get all annotation types from the database.

#     Args:
#         db (Session): The database session.

#     Returns:
#         dict: List of annotation types.
#     """
#     # Retrieve all annotation types from the database
#     annotation_types = db.query(AnnotationFeatureModel).filter_by(is_active=True).all()

#     # Format response data
#     data = [
#         # annotation_type.code_name
#         {
#             "id": annotation_type.id,
#             "name": annotation_type.name,
#             "code_name": annotation_type.code_name,
#             "description": annotation_type.description,
#             "logo_url": annotation_type.logo_url,
#         }
#         for annotation_type in annotation_types
#     ]

#     # Return standardized response
#     return standard_response(
#         status="success",
#         status_code=200,
#         message_code="annotation_types_retrieved",
#         data=data,
#     )

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
#     # Retrieve the annotation type ID from the database
#     annotation_type_entry = (
#         db.query(AnnotationFeatureModel)
#         .filter(AnnotationFeatureModel.code_name == annotation_type)
#         .first()
#     )

#     if not annotation_type_entry:
#         raise HTTPException(
#             status_code=400,
#             detail=f"Invalid annotation type: {annotation_type}",
#         )

#     # Query annotations by type ID
#     annotations = (
#         db.query(AnnotationProjectModel)
#         .filter(AnnotationProjectModel.annotation_type_id == annotation_type_entry.id)
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
#                 "annotation_type": annotation_type_entry.name,  # Use human-readable name
#                 "menu_id": annotation.menu_id,
#                 "created_by": annotation.created_by,
#                 "created_at": annotation.created_at,
#             }
#             for annotation in annotations
#         ],
#     )


# @router.get(
#     "/", summary="Get All Annotations", description="Retrieve all annotations data."
# )
# def fetch_annotations():
#     """
#     Retrieve all annotations data.
#     """
#     annotations = get_annotations()
#     return standard_response(
#         status="success",
#         status_code=200,
#         message_code="annotations_fetched",
#         data=annotations,
#     )


# @router.get(
#     "/{annotation_name}",
#     summary="Get Annotation by Name",
#     description="Retrieve a specific annotation by its name.",
# )
# def fetch_annotation_by_name(annotation_name: str):
#     """
#     Retrieve a specific annotation by its name.

#     Args:
#         annotation_name (str): Name of the annotation.

#     Returns:
#         dict: The annotation data if found.

#     Raises:
#         HTTPException: If no annotation with the given name exists.
#     """
#     annotation = get_annotation_by_name(annotation_name)
#     if not annotation:
#         return standard_response(
#             status="error",
#             status_code=404,
#             message_code="annotation_not_found",
#             data=None,
#         )
#     return standard_response(
#         status="success",
#         status_code=200,
#         message_code="annotation_fetched",
#         data=annotation,
#     )


# @router.get(
#     "/computer_vision/",
#     summary="Get All Computer Vision Annotations",
#     description="Retrieve all computer vision annotations data.",
# )
# def fetch_annotations_computer_vision():
#     """
#     Fetch all computer vision annotations data.
#     """
#     annotations = get_annotations_computer_vision()
#     return standard_response(
#         status="success",
#         status_code=200,
#         message_code="computer_vision_annotations_fetched",
#         data=annotations,
#     )






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