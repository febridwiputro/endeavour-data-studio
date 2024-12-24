from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.schemas.menu.menu_schema import MenuResponse, MenuCreate
from app.services.menu.menu_service import get_all_menus, create_menu
from app.config.database import get_db
from app.data.menu import menu


# router = APIRouter(prefix="/menus", tags=["Menus"])
router = APIRouter()

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

