from fastapi import APIRouter
from app.data.menu import menu

router = APIRouter()

@router.get("/")
async def get_menu():
    return menu
