from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.menu.annotations.annotation_sub_feature_2_model import SubFeature2Model
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

# SubFeature2Model Endpoints
@router.post("/")
def create_sub_feature_2(data: dict, db: Session = Depends(get_db)):
    return create_item(SubFeature2Model, data, db)

@router.get("/")
def read_sub_features_2(db: Session = Depends(get_db)):
    return read_items(SubFeature2Model, db)

@router.put("/{sub_feature_id}")
def update_sub_feature_2(sub_feature_id: int, updates: dict, db: Session = Depends(get_db)):
    return update_item(SubFeature2Model, sub_feature_id, updates, db)

@router.delete("/{sub_feature_id}")
def delete_sub_feature_2(sub_feature_id: int, db: Session = Depends(get_db)):
    return delete_item(SubFeature2Model, sub_feature_id, db)

# SubFeature2Model
@router.get("/by-name/{name}")
def get_sub_feature2_by_name(name: str, db: Session = Depends(get_db)):
    result = get_by_parameter(SubFeature2Model, db, name=name)
    return standard_response("success", 200, "SUB_FEATURE2_FOUND", result)

@router.get("/{sub_feature_1_id}")
def get_sub_feature2_by_sub_feature1(sub_feature_1_id: int, db: Session = Depends(get_db)):
    return get_by_parameter(SubFeature2Model, db, sub_feature_1_id=sub_feature_1_id)


@router.get("/by-creator/{created_by}")
def get_sub_feature2_by_creator(created_by: int, db: Session = Depends(get_db)):
    result = get_by_parameter(SubFeature2Model, db, created_by=created_by)
    return standard_response("success", 200, "SUB_FEATURE2_FOUND", result)