from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.schemas.menu.menu_schema import MenuResponse, MenuCreate
from app.services.menu.menu_service import get_all_menus, create_menu
from app.config.database import get_db
from app.data.menu import menu
from app.models.menu.menu_model import MenuModel
from app.utils.response_utils import standard_response

# router = APIRouter(prefix="/menus", tags=["Menus"])
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
        raise HTTPException(
            status_code=404, 
            detail=f"No {model.__tablename__} found with the specified parameters."
        )
    return result

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

# MenuModel Endpoints
@router.post("/menus")
def create_menu(data: dict, db: Session = Depends(get_db)):
    return create_item(MenuModel, data, db)

@router.get("/menus")
def read_menus(db: Session = Depends(get_db)):
    # return read_items(MenuModel, db)

    query = db.query(MenuModel)    
    query = query.filter(MenuModel.is_active == True)

    items = query.all()
    return standard_response("success", 200, "FETCHED", items)

@router.put("/menus/{menu_id}")
def update_menu(menu_id: int, updates: dict, db: Session = Depends(get_db)):
    return update_item(MenuModel, menu_id, updates, db)

@router.delete("/menus/{menu_id}")
def delete_menu(menu_id: int, db: Session = Depends(get_db)):
    return delete_item(MenuModel, menu_id, db)

# MenuModel
@router.get("/menus/by-name/{name}")
def get_menu_by_name(name: str, db: Session = Depends(get_db)):
    result = get_by_parameter(MenuModel, db, name=name)
    return standard_response("success", 200, "MENU_FOUND", result)

@router.get("/menus/by-status/{is_active}")
def get_menu_by_status(is_active: bool, db: Session = Depends(get_db)):
    result = get_by_parameter(MenuModel, db, is_active=is_active)
    return standard_response("success", 200, "MENU_FOUND", result)

@router.get("/menus/by-created-by/{created_by}")
def get_menu_by_creator(created_by: int, db: Session = Depends(get_db)):
    result = get_by_parameter(MenuModel, db, created_by=created_by)
    return standard_response("success", 200, "MENU_FOUND", result)


@router.get("/")
async def get_menu():
    return menu

@router.post("/", response_model=MenuResponse, summary="Create Menu", description="Create a new menu entry.")
def create_menu_endpoint(
    menu_data: MenuCreate,
    db: Session = Depends(get_db),
    user_id: Optional[int] = 1,  # Default user_id to 1 if not provided
):
    """
    Create a new menu.

    Parameters:
    - `menu_data` (MenuCreate): Data for the new menu.
    - `db` (Session): Database session.
    - `user_id` (int): ID of the user creating the menu (from query parameter or default).

    Returns:
    - `MenuResponse`: The created menu entry.
    """
    if user_id is None:
        raise HTTPException(status_code=400, detail="User ID is required.")

    try:
        # Call service to create menu
        new_menu = create_menu(db, menu_data, user_id)
        return new_menu
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create menu: {str(e)}")


# @router.post("/", response_model=MenuResponse)
# def create_menu_endpoint(
#     menu_data: MenuCreate,
#     db: Session = Depends(get_db),
#     user_id: int = 1,  # Replace with actual user ID from authentication
# ):
#     """
#     Create a new menu.

#     Parameters:
#     - `menu_data` (MenuCreate): Data for the new menu.
#     - `db` (Session): Database session.
#     - `user_id` (int): ID of the user creating the menu (from authentication).

#     Returns:
#     - `MenuResponse`: The created menu entry.
#     """
#     try:
#         new_menu = create_menu(db, menu_data, user_id)
#         return new_menu
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to create menu: {str(e)}")

# @router.get("/", response_model=List[MenuResponse])
# def fetch_menus(
#     menu_type: Optional[str] = None,
#     is_active: Optional[bool] = None,
#     name: Optional[str] = None,
#     db: Session = Depends(get_db),
# ):
#     """
#     Fetch all menus with optional filters.

#     Parameters:
#     - `menu_type` (Optional[str]): Filter by menu type.
#     - `is_active` (Optional[bool]): Filter by active status.
#     - `name` (Optional[str]): Filter by menu name (partial match).

#     Returns:
#     - List of menus matching the filters.
#     """
#     try:
#         menus = get_all_menus(db, menu_type=menu_type, is_active=is_active, name=name)
#         return menus
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

