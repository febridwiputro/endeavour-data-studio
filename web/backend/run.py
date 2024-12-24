import uvicorn
from app.config.config import settings


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.SERVER_HOST,
        port=settings.SERVER_PORT,
        reload=True,
        workers=2,
    )

"""
alembic revision --autogenerate -m "Initial migration"
alembic revision --autogenerate -m "Initial annotations"
alembic upgrade head
"""

"""
https://www.svgrepo.com/show/65453/avatar.svg

"""