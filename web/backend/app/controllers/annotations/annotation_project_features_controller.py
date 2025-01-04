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

@router.get("/")
def read_annotation_project_features(db: Session = Depends(get_db)):
    return read_items(AnnotationProjectFeatureModel, db)

@router.put("/{feature_id}")
def update_annotation_project_feature(feature_id: int, updates: dict, db: Session = Depends(get_db)):
    return update_item(AnnotationProjectFeatureModel, feature_id, updates, db)

@router.delete("/{feature_id}")
def delete_annotation_project_feature(feature_id: int, db: Session = Depends(get_db)):
    return delete_item(AnnotationProjectFeatureModel, feature_id, db)