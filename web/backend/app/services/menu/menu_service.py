from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.menu.menus_model import MenuModel
from app.schemas.menu.menu_schema import MenuCreate

def get_all_menus(
    db: Session,
    menu_type: Optional[str] = None,
    is_active: Optional[bool] = None,
    name: Optional[str] = None,
) -> List[MenuModel]:
    query = db.query(MenuModel)

    if menu_type:
        query = query.filter(MenuModel.type == menu_type)
    if is_active is not None:
        query = query.filter(MenuModel.is_active == is_active)
    if name:
        query = query.filter(MenuModel.name.ilike(f"%{name}%"))

    return query.all()

def create_menu(db: Session, menu_data: MenuCreate, user_id: int) -> MenuModel:
    """
    Create a new menu entry in the database.
    
    Parameters:
    - db (Session): SQLAlchemy session.
    - menu_data (MenuCreate): Data for the new menu.
    - user_id (int): ID of the user creating the menu.
    
    Returns:
    - MenuModel: The created menu entry.
    """
    new_menu = MenuModel(
        name=menu_data.name,
        description=menu_data.description,
        type=menu_data.type,
        is_active=menu_data.is_active,
        metadata=menu_data.metadata,
        logo_url=menu_data.logo_url,
        created_by=user_id,
        updated_by=user_id,
    )
    db.add(new_menu)
    db.commit()
    db.refresh(new_menu)
    return new_menu